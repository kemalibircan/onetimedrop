import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import translate from '@iamtraction/google-translate';

const locales = ['de', 'tr', 'fr', 'es', 'ar'];

const dictPath = path.join(process.cwd(), 'dictionaries');
const enDictPath = path.join(dictPath, 'en.json');
const enDict = JSON.parse(fs.readFileSync(enDictPath, 'utf-8'));

const blogDir = path.join(process.cwd(), 'content/blog/en');

async function translateObj(obj: any, lang: string): Promise<any> {
  const result: any = {};
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'string') {
      try {
        const res = await translate(obj[key], { to: lang });
        result[key] = res.text;
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
        const titleRes = await translate(data.title || "", { to: lang });
        const descRes = await translate(data.description || "", { to: lang });
        const catRes = await translate(data.category || "", { to: lang });
        
        let translatedContent = content;
        try {
           const contentRes = await translate(content, { to: lang });
           translatedContent = contentRes.text;
        } catch (e: any) {
           console.log("Content too long or error, skipping content translation", e.message);
        }
        
        const newData: any = { ...data, title: titleRes.text, description: descRes.text, category: catRes.text };
        if (newData.canonical) {
            newData.canonical = newData.canonical.replace('onetimedrop.io/blog/', `onetimedrop.io/${lang}/blog/`);
        }
        
        const newRaw = matter.stringify(translatedContent, newData);
        fs.writeFileSync(outPath, newRaw);
      } catch (e: any) {
        console.error(`Error translating blog ${file} to ${lang}`, e.message);
      }
      // Wait to avoid rate limits
      await new Promise(r => setTimeout(r, 1500));
    }
  }
}

async function main() {
  await translateDictionaries();
  await translateBlogs();
  console.log("Done!");
}

main();
