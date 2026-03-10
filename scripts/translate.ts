import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import translate from '@iamtraction/google-translate';

const locales = ['de', 'tr', 'fr', 'es', 'ar'];
const LINK_TOKEN_PREFIX = 'OTDURLTOKEN';
const MAX_TRANSLATE_RETRIES = 3;

const dictPath = path.join(process.cwd(), 'dictionaries');
const enDictPath = path.join(dictPath, 'en.json');
const enDict = JSON.parse(fs.readFileSync(enDictPath, 'utf-8'));

const blogDir = path.join(process.cwd(), 'content/blog/en');

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function translateTextWithRetry(text: string, lang: string): Promise<string> {
  if (!text) return text;

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_TRANSLATE_RETRIES; attempt++) {
    try {
      const res = await translate(text, { to: lang });
      return res.text;
    } catch (e) {
      lastError = e;
      if (attempt < MAX_TRANSLATE_RETRIES) {
        await sleep(750 * attempt);
      }
    }
  }

  throw lastError;
}

function protectMarkdownLinkUrls(markdown: string) {
  const urls: string[] = [];
  const protectedText = markdown.replace(/\]\(([^)]+)\)/g, (_match, url: string) => {
    const token = `${LINK_TOKEN_PREFIX}${urls.length}END`;
    urls.push(url);
    return `](${token})`;
  });

  return { protectedText, urls };
}

function restoreMarkdownLinkUrls(markdown: string, urls: string[]) {
  let restored = markdown;
  urls.forEach((url, index) => {
    const token = `${LINK_TOKEN_PREFIX}${index}END`;
    restored = restored.replace(new RegExp(token, 'gi'), url);
  });
  return restored;
}

async function translateMarkdownContent(content: string, lang: string): Promise<string> {
  const { protectedText, urls } = protectMarkdownLinkUrls(content);
  const translated = await translateTextWithRetry(protectedText, lang);
  return restoreMarkdownLinkUrls(translated, urls);
}

async function translateObj(obj: any, lang: string): Promise<any> {
  const result: any = {};
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'string') {
      try {
        result[key] = await translateTextWithRetry(obj[key], lang);
      } catch (e) {
        console.error(`Error translating to ${lang}`, e);
        result[key] = obj[key];
      }
    } else {
      result[key] = await translateObj(obj[key], lang);
    }
  }
  return result;
}

async function translateDictionaries() {
  console.log("Translating dictionaries...");
  for (const lang of locales) {
    const outPath = path.join(dictPath, `${lang}.json`);
    if (fs.existsSync(outPath)) continue;
    console.log(` Translating UI to ${lang}...`);
    const translated = await translateObj(enDict, lang);
    fs.writeFileSync(outPath, JSON.stringify(translated, null, 2));
  }
}

async function translateBlogs() {
  console.log("Translating blogs...");
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md') && !f.startsWith('_'));
  
  for (const lang of locales) {
    const langDir = path.join(process.cwd(), 'content/blog', lang);
    if (!fs.existsSync(langDir)) fs.mkdirSync(langDir, { recursive: true });
    
    for (const file of files) {
      const outPath = path.join(langDir, file);
      if (fs.existsSync(outPath)) continue;
      
      console.log(` Translating ${file} to ${lang}...`);
      const raw = fs.readFileSync(path.join(blogDir, file), 'utf-8');
      const { data, content } = matter(raw);
      
      try {
        const translatedTitle = await translateTextWithRetry(data.title || "", lang);
        const translatedDescription = await translateTextWithRetry(data.description || "", lang);
        const translatedCategory = await translateTextWithRetry(data.category || "", lang);
        
        let translatedContent = content;
        try {
           translatedContent = await translateMarkdownContent(content, lang);
        } catch (e: any) {
           console.log("Content too long or error, skipping content translation", e.message);
        }
        
        const newData: any = {
          ...data,
          title: translatedTitle,
          description: translatedDescription,
          category: translatedCategory,
        };
        if (newData.canonical) {
            newData.canonical = newData.canonical.replace('onetimedrop.io/blog/', `onetimedrop.io/${lang}/blog/`);
        }
        
        const newRaw = matter.stringify(translatedContent, newData);
        fs.writeFileSync(outPath, newRaw);
      } catch (e: any) {
        console.error(`Error translating blog ${file} to ${lang}`, e.message);
      }
      // Wait to avoid rate limits
      await sleep(1500);
    }
  }
}

async function main() {
  await translateDictionaries();
  await translateBlogs();
  console.log("Done!");
}

main();
