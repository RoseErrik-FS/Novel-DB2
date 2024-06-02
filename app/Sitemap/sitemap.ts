import { MetadataRoute } from "next";
import { config } from "dotenv";
import fetch from "node-fetch";
import { getMockNovels } from "../../lib/getMockData";
import { INovel } from "../../models/novel";

config();

export const dynamic = "force-dynamic";

const domain = process.env.NEXT_PUBLIC_DOMAIN || "https://your-domain.com";
console.log("Domain:", domain);

function chunkRange(
  totalItems: number,
  chunkSize: number
): { start: number; end: number }[] {
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
  console.log("Fetching novels from:", `${baseUrl}/api/novels`);

  let novels: INovel[] = [];

  try {
    novels = await fetchJSON(`${baseUrl}/api/novels`);
  } catch (error) {
    console.error("Error fetching data for sitemap:", error);
    if (process.env.NODE_ENV === "production") {
      return [];
    } else {
      // Use mock data for non-production environments or when the API server is not available
      novels = getMockNovels();
    }
  }

  const totalNovels = novels.length;
  const novelChunkedRanges = chunkRange(totalNovels, 50000);

  return [
    { id: "static" },
    ...novelChunkedRanges.map(({ start, end }) => ({
      id: `novels-${start}-${end}`,
    })),
  ];
}

export default async function sitemap({
  params,
}: {
  params: { id: string };
}): Promise<MetadataRoute.Sitemap> {
  const { id } = params;
  const baseUrl = `${domain}`;
  console.log("Generating sitemap for id:", id);

  let novels: INovel[] = [];

  try {
    novels = await fetchJSON(`${baseUrl}/api/novels`);
  } catch (error) {
    console.error("Error fetching data for sitemap:", error);
    if (process.env.NODE_ENV !== "production") {
      // Use mock data for non-production environments or when the API server is not available
      novels = getMockNovels();
    } else {
      return [];
    }
  }

  if (id === "static") {
    return [
      { url: `${domain}/`, lastModified: new Date().toISOString() },
      { url: `${domain}/MyList`, lastModified: new Date().toISOString() },
      { url: `${domain}/NewReleases`, lastModified: new Date().toISOString() },
      {
        url: `${domain}/PopularNovels`,
        lastModified: new Date().toISOString(),
      },
      { url: `${domain}/Search`, lastModified: new Date().toISOString() },
    ];
  }

  if (id.startsWith("novels-")) {
    const [_, start, end] = id.split("-").map(Number);
    const novelChunk = novels.slice(start, end);

    return novelChunk.map((novel) => ({
      url: `${domain}/novels/${novel._id}`,
      lastModified: new Date().toISOString(),
      title: novel.title,
    }));
  }

  return [];
}
