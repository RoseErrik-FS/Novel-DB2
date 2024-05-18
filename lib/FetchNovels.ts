import { INovel } from "@/models/novel";

const fetchJSON = async (url: string): Promise<any> => {
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch ${url}: ${errorText}`);
  }
  return response.json();
};

export async function fetchNovels(baseUrl: string): Promise<INovel[]> {
  try {
    const response = await fetchJSON(`${baseUrl}/api/novels`);
    return response;
  } catch (error) {
    console.error('Error fetching novels:', error);
    return [];
  }
}

export async function fetchAndSortNovels(baseUrl: string): Promise<INovel[]> {
  try {
    const novels = await fetchNovels(baseUrl);
    return novels.sort((a, b) => b.rating - a.rating);
  } catch (error) {
    console.error('Error fetching and sorting novels:', error);
    return [];
  }
}

export async function fetchNovelById(baseUrl: string, novelId: string): Promise<INovel | null> {
  try {
    const response = await fetchJSON(`${baseUrl}/api/novels/${novelId}`);
    return response;
  } catch (error) {
    console.error('Error fetching novel:', error);
    return null;
  }
}

export async function fetchNewReleases(baseUrl: string): Promise<INovel[]> {
  try {
    const novels = await fetchNovels(baseUrl);
    return novels.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
  } catch (error) {
    console.error('Error fetching new releases:', error);
    return [];
  }
}
