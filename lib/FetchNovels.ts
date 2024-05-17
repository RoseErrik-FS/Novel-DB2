import { INovel } from "@/models/novel";

export async function fetchNovels(baseUrl: string): Promise<INovel[]> {
  try {
    const response = await fetch(`${baseUrl}/api/novels`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching novels:', error);
    return [];
  }
}

export async function fetchAndSortNovels(baseUrl: string): Promise<INovel[]> {
  const novels = await fetchNovels(baseUrl);
  return novels.sort((a, b) => b.rating - a.rating);
}

export async function fetchNovelById(baseUrl: string, novelId: string): Promise<INovel | null> {
  try {
    const response = await fetch(`${baseUrl}/api/novels/${novelId}`);
    if (!response.ok) {
      throw new Error('Novel not found');
    }
    const data = await response.json();
    return data;
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
