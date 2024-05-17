import type { MetadataRoute } from 'next';
import { config } from 'dotenv';

config();

const domain = process.env.NEXT_PUBLIC_DOMAIN;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const [totalNovels, totalReviews] = await Promise.all([
    fetchTotalNovels(),
    fetchTotalReviews(),
  ]);

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: [
      `${domain}/api/sitemap/static`,
      ...generateNovelsChunkSitemaps(totalNovels),
      ...generateReviewsChunkSitemaps(totalReviews),
    ],
  };
}

async function fetchTotalNovels(): Promise<number> {
  const response = await fetch(`${domain}/api/novels/count`);
  const data = await response.json();
  return data.count;
}

async function fetchTotalReviews(): Promise<number> {
  const response = await fetch(`${domain}/api/reviews/count`);
  const data = await response.json();
  return data.count;
}

function generateNovelsChunkSitemaps(totalNovels: number): string[] {
  const chunkSize = 50000;
  const chunkRanges = chunkRange(totalNovels, chunkSize);

  return chunkRanges.map(({ start, end }) => `${domain}/api/sitemap/novels-${start}-${end}`);
}

function generateReviewsChunkSitemaps(totalReviews: number): string[] {
  const chunkSize = 50000;
  const chunkRanges = chunkRange(totalReviews, chunkSize);

  return chunkRanges.map(({ start, end }) => `${domain}/api/sitemap/reviews-${start}-${end}`);
}

function chunkRange(totalItems: number, chunkSize: number): { start: number; end: number }[] {
  const ranges = [];

  for (let start = 0; start < totalItems; start += chunkSize) {
    const end = Math.min(start + chunkSize, totalItems);
    ranges.push({ start, end });
  }

  return ranges;
}