import type { MetadataRoute } from 'next';
import { config } from 'dotenv';

config();

const domain = process.env.NEXT_PUBLIC_DOMAIN || 'https://your-domain.com';

interface Novel {
  _id: string;
  title: string;
  updatedAt: string;
}

interface Review {
  _id: string;
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

export async function generateSitemaps(): Promise<SitemapId[]> {
  const baseUrl = `${domain}`;

  const novelsResponse = await fetch(`${baseUrl}/api/novels`);
  const novels: Novel[] = await novelsResponse.json();

  const reviewsResponse = await fetch(`${baseUrl}/api/reviews`);
  const reviews: Review[] = await reviewsResponse.json();

  const totalNovels = novels.length;
  const totalReviews = reviews.length;

  const novelChunkedRanges = chunkRange(totalNovels, 50000);
  const reviewChunkedRanges = chunkRange(totalReviews, 50000);

  return [
    { id: 'static' },
    ...novelChunkedRanges.map(({ start, end }) => ({
      id: `novels-${start}-${end}`,
    })),
    ...reviewChunkedRanges.map(({ start, end }) => ({
      id: `reviews-${start}-${end}`,
    })),
  ];
}

export default async function sitemap({ params }: { params: { id: string } }): Promise<MetadataRoute.Sitemap> {
  const { id } = params;
  const baseUrl = `${domain}`;
  const novelsResponse = await fetch(`${baseUrl}/api/novels`);
  const novels: Novel[] = await novelsResponse.json();
  const reviewsResponse = await fetch(`${baseUrl}/api/reviews`);
  const reviews: Review[] = await reviewsResponse.json();

  if (id === 'static') {
    return [
      { url: `${domain}/` },
      { url: `${domain}/MyList` },
      { url: `${domain}/NewReleases` },
      { url: `${domain}/PopularNovels` },
      { url: `${domain}/Search` },
    ];
  }

  if (id.startsWith('novels-')) {
    const [_, start, end] = id.split('-').map(Number);
    const novelChunk = novels.slice(start, end);

    return novelChunk.map((novel: Novel, index: number) => ({
      url: `${domain}/novels/${novel._id}`,
      lastModified: novel.updatedAt,
      title: novel.title,
    }));
  }

  if (id.startsWith('reviews-')) {
    const [_, start, end] = id.split('-').map(Number);
    const reviewChunk = reviews.slice(start, end);

    return reviewChunk.map((review: Review, index: number) => ({
      url: `${domain}/reviews/${review._id}`,
      lastModified: review.updatedAt,
    }));
  }

  return [];
}