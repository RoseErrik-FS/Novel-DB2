import type { MetadataRoute } from 'next';
import { config } from 'dotenv';
import fetch from 'node-fetch'; // Ensure you have installed node-fetch

config();

const domain = process.env.NEXT_PUBLIC_DOMAIN || 'https://your-domain.com';
console.log('Domain:', domain);

interface Novel {
  _id: string;
  title: string;
  updatedAt: string;
}

function chunkRange(totalItems: number, chunkSize: number): { start: number; end: number }[] {
  const ranges = [];
  for (let start = 0; start < totalItems; start += chunkSize) {
    const end = Math.min(start + chunkSize, totalItems);
    ranges.push({ start, end });
  }
  return ranges;
}

interface SitemapId {
  id: string;
}

async function fetchJSON(url: string): Promise<any> {
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch ${url}: ${errorText}`);
  }
  return response.json();
}

export async function generateSitemaps(): Promise<SitemapId[]> {
  const baseUrl = `${domain}`;
  console.log('Fetching novels from:', `${baseUrl}/api/novels`);

  let novels: Novel[] = [];

  if (process.env.NODE_ENV === 'production') {
    try {
      novels = await fetchJSON(`${baseUrl}/api/novels`);
    } catch (error) {
      console.error('Error fetching data for sitemap:', error);
      return [];
    }
  } else {
    // Mock data for non-production environments
    novels = [{ _id: '1', title: 'Mock Novel', updatedAt: new Date().toISOString() }];
  }

  const totalNovels = novels.length;
  const novelChunkedRanges = chunkRange(totalNovels, 50000);

  return [
    { id: 'static' },
    ...novelChunkedRanges.map(({ start, end }) => ({
      id: `novels-${start}-${end}`,
    })),
  ];
}

export default async function sitemap({ params }: { params: { id: string } }): Promise<MetadataRoute.Sitemap> {
  const { id } = params;
  const baseUrl = `${domain}`;
  console.log('Generating sitemap for id:', id);

  let novels: Novel[] = [];

  if (process.env.NODE_ENV === 'production') {
    try {
      novels = await fetchJSON(`${baseUrl}/api/novels`);
    } catch (error) {
      console.error('Error fetching data for sitemap:', error);
      return [];
    }
  } else {
    // Mock data for non-production environments
    novels = [{ _id: '1', title: 'Mock Novel', updatedAt: new Date().toISOString() }];
  }

  if (id === 'static') {
    return [
      { url: `${domain}/`, lastModified: new Date().toISOString() },
      { url: `${domain}/MyList`, lastModified: new Date().toISOString() },
      { url: `${domain}/NewReleases`, lastModified: new Date().toISOString() },
      { url: `${domain}/PopularNovels`, lastModified: new Date().toISOString() },
      { url: `${domain}/Search`, lastModified: new Date().toISOString() },
    ];
  }

  if (id.startsWith('novels-')) {
    const [_, start, end] = id.split('-').map(Number);
    const novelChunk = novels.slice(start, end);

    return novelChunk.map((novel: Novel) => ({
      url: `${domain}/novels/${novel._id}`,
      lastModified: novel.updatedAt,
      title: novel.title,
    }));
  }

  return [];
}
