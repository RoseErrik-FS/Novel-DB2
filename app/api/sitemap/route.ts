import { generateSitemaps } from "@/app/Sitemap/sitemap";


async function GET(request: Request) {
  const sitemaps = await generateSitemaps();

  return new Response(JSON.stringify(sitemaps), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export { GET };