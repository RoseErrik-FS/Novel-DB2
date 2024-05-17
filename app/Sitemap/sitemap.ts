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

  const novels: Novel[] = await fetchJSON(`${baseUrl}/api/novels`);
  const reviews: Review[] = await fetchJSON(`${baseUrl}/api/reviews`);

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
  
  let novels: Novel[] = [];
  let reviews: Review[] = [];

  try {
    novels = await fetchJSON(`${baseUrl}/api/novels`);
    reviews = await fetchJSON(`${baseUrl}/api/reviews`);
  } catch (error) {
    console.error('Error fetching data for sitemap:', error);
    // Return an empty sitemap in case of errors to prevent build failures
    return [];
  }

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

    return novelChunk.map((novel: Novel) => ({
      url: `${domain}/novels/${novel._id}`,
      lastModified: novel.updatedAt,
      title: novel.title,
    }));
  }

  if (id.startsWith('reviews-')) {
    const [_, start, end] = id.split('-').map(Number);
    const reviewChunk = reviews.slice(start, end);

    return reviewChunk.map((review: Review) => ({
      url: `${domain}/reviews/${review._id}`,
      lastModified: review.updatedAt,
    }));
  }

  return [];
}
