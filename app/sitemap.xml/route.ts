import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://onetimedrop.io";

const staticPages = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/how-it-works", priority: "0.9", changefreq: "monthly" },
  { url: "/join", priority: "0.8", changefreq: "monthly" },
  { url: "/blog", priority: "0.8", changefreq: "weekly" },
  { url: "/privacy", priority: "0.5", changefreq: "yearly" },
  { url: "/terms", priority: "0.5", changefreq: "yearly" },
  { url: "/contact", priority: "0.6", changefreq: "yearly" },
];

export async function GET() {
  const posts = getAllPosts();

  const blogPages = posts.map((post) => ({
    url: `/blog/${post.slug}`,
    priority: "0.7",
    changefreq: "monthly",
    lastmod: post.date,
  }));

  const allPages = [...staticPages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${"lastmod" in page && page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ""}
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=600",
    },
  });
}
