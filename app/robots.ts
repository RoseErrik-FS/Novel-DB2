import type { MetadataRoute } from 'next';
import { config } from 'dotenv';

config();

const domain = process.env.NEXT_PUBLIC_DOMAIN || 'https://your-domain.com';

export default async function robots(): Promise<MetadataRoute.Robots> {
  let totalNovels: number;

  try {
    totalNovels = await fetchTotalNovels();
  } catch (error) {
    console.error('Error fetching total novels:', error);
    totalNovels = 0; // Fallback to 0 if fetching fails
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: [
      `${domain}/api/sitemap/static`,
      ...generateNovelsChunkSitemaps(totalNovels),
    ],
  };
}

async function fetchTotalNovels(): Promise<number> {
  const response = await fetch(`${domain}/api/novels/count`);
  if (!response.ok) {
    throw new Error(`Failed to fetch total novels: ${response.statusText}`);
  }
  const data = await response.json();
  return data.count;
}

function generateNovelsChunkSitemaps(totalNovels: number): string[] {
  const chunkSize = 50000;
  const chunkRanges = chunkRange(totalNovels, chunkSize);

  return chunkRanges.map(({ start, end }) => `${domain}/api/sitemap/novels-${start}-${end}`);
}

function chunkRange(totalItems: number, chunkSize: number): { start: number; end: number }[] {
  const ranges = [];

  for (let start = 0; start < totalItems; start += chunkSize) {
    const end = Math.min(start + chunkSize, totalItems);
    ranges.push({ start, end });
  }

  return ranges;
}
