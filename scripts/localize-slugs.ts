import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Custom slugify to handle Turkish and other characters
function createSlug(text: string): string {
  const map: Record<string, string> = {
    'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c',
    'İ': 'i', 'Ğ': 'g', 'Ü': 'u', 'Ş': 's', 'Ö': 'o', 'Ç': 'c',
    'ß': 'ss', 'ä': 'a', 'Ä': 'A',
    'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e', 'à': 'a', 'â': 'a', 'ù': 'u',
    'û': 'u', 'î': 'i', 'ï': 'i', 'ô': 'o', 'œ': 'oe',
    'ñ': 'n', 'á': 'a', 'í': 'i', 'ó': 'o', 'ú': 'u',
  };

  let t = text;
  for (const k in map) {
    t = t.replace(new RegExp(k, 'g'), map[k]);
  }
  
  return t
    .normalize('NFD') // splits accented characters
    .replace(/[\u0300-\u036f]/g, '') // removes diacritical marks
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s\-]/g, '') // remove non-alphanumeric except spaces and hyphens
    .replace(/\s+/g, '-') // convert spaces to hyphens
    .replace(/\-+/g, '-'); // replace multiple hyphens
}

const contentDir = path.join(process.cwd(), "content/blog");
const langs = fs.readdirSync(contentDir).filter(d => fs.statSync(path.join(contentDir, d)).isDirectory());

const enDir = path.join(contentDir, "en");
if (!fs.existsSync(enDir)) {
  console.error("English directory not found");
  process.exit(1);
}

const enFiles = fs.readdirSync(enDir).filter(f => f.endsWith(".md") && !f.startsWith("_"));

for (const lang of langs) {
  const langDir = path.join(contentDir, lang);
  console.log(`Processing language: ${lang}`);

  for (const file of enFiles) {
    const langFilePath = path.join(langDir, file);
    if (!fs.existsSync(langFilePath)) continue;

    const raw = fs.readFileSync(langFilePath, "utf8");
    const parsed = matter(raw);
    
    parsed.data.translationKey = file.replace(/\.md$/, "");
    if (lang === "en") {
      parsed.data.slug = parsed.data.translationKey;
    } else {
      parsed.data.slug = parsed.data.title ? createSlug(parsed.data.title) : parsed.data.translationKey;
    }
    
    // Delete canonical so it can be dynamically generated correctly in generateMetadata
    delete parsed.data.canonical;

    const newFileContent = matter.stringify(parsed.content, parsed.data);
    fs.writeFileSync(langFilePath, newFileContent, "utf8");
  }
}
console.log("Slugs localized successfully.");
