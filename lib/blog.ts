import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readingTime: string;
  canonical?: string;
  translationKey: string;
  content: string;
}

const getBlogDir = (lang: string = 'en') => path.join(process.cwd(), `content/blog/${lang}`);

export function getAllPosts(lang: string = 'en'): BlogPost[] {
  const dir = getBlogDir(lang);
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: data.slug || file.replace(/\.md$/, ""),
        title: data.title || "Untitled",
        description: data.description || "",
        date: data.date || "",
        category: data.category || "General",
        readingTime: data.readingTime || "5 min read",
        canonical: data.canonical || "",
        translationKey: data.translationKey || "",
        content,
      } as BlogPost;
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string, lang: string = 'en'): BlogPost | null {
  const posts = getAllPosts(lang);
  return posts.find((p) => p.slug === slug) || null;
}

export function getPostAlternateSlugs(translationKey: string): Record<string, string> {
  const dir = path.join(process.cwd(), "content/blog");
  if (!fs.existsSync(dir)) return {};
  const langs = fs.readdirSync(dir).filter(d => fs.statSync(path.join(dir, d)).isDirectory());
  
  const altSlugs: Record<string, string> = {};
  for (const lang of langs) {
    const posts = getAllPosts(lang);
    const post = posts.find(p => p.translationKey === translationKey);
    if (post) {
      altSlugs[lang] = post.slug;
    }
  }
  return altSlugs;
}
