import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://onetimedrop.com";
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

// Pages with their priorities and change frequencies
const STATIC_PATHS = [
  { path: "",            priority: "1.0", changefreq: "weekly"  },  // home
  { path: "/how-it-works", priority: "0.9", changefreq: "monthly" },
  { path: "/blog",        priority: "0.8", changefreq: "weekly"  },
  { path: "/join",        priority: "0.7", changefreq: "monthly" },
  { path: "/contact",     priority: "0.6", changefreq: "yearly"  },
  { path: "/privacy",     priority: "0.4", changefreq: "yearly"  },
  { path: "/terms",       priority: "0.4", changefreq: "yearly"  },
];

function buildAlternates(path: string) {
  const alternates = LOCALES.map(
    (l) => `      <xhtml:link rel="alternate" hreflang="${l}" href="${BASE_URL}/${l}${path}"/>`
  );
  // x-default points to /en
  alternates.push(
    `      <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/en${path}"/>`
  );
  return alternates.join("\n");
}

export async function GET() {
  const enPosts = getAllPosts("en");
  const today = new Date().toISOString().split("T")[0];

  /* ── Static pages ── */
  const staticUrls = STATIC_PATHS.flatMap(({ path, priority, changefreq }) =>
    LOCALES.map(
      (lang) => `  <url>
    <loc>${BASE_URL}/${lang}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <lastmod>${today}</lastmod>
${buildAlternates(path)}
  </url>`
    )
  );

  /* ── Blog post pages ── */
  const blogUrls = enPosts.flatMap((post) => {
    const path = `/blog/${post.slug}`;
    const lastmod = post.date || today;
    return LOCALES.map(
      (lang) => `  <url>
    <loc>${BASE_URL}/${lang}${path}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <lastmod>${lastmod}</lastmod>
${buildAlternates(path)}
  </url>`
    );
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">

${[...staticUrls, ...blogUrls].join("\n\n")}

</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=600",
    },
  });
}
