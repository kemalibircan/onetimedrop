export async function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /api/

# Block join page from indexing (session-specific, no SEO value)
Disallow: /*/join

Sitemap: https://onetimedrop.com/sitemap.xml
`;

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
