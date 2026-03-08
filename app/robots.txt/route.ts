export async function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /session/

Sitemap: https://onetimedrop.io/sitemap.xml
`;

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
