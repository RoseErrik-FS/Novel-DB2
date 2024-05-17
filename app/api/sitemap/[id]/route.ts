import sitemap from "@/app/Sitemap/sitemap";


export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const sitemapData = await sitemap({ params: { id } });

  return new Response(JSON.stringify(sitemapData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}