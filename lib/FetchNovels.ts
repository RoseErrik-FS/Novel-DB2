import { IMyList } from "@/models/myList";
import { INovel } from "@/models/novel";
import { checkApiHealth } from "./health";


const fetchJSON = async (url: string): Promise<any> => {
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch ${url}: ${errorText}`);
  }
  return response.json();
};

const retry = async <T>(fn: () => Promise<T>, retries: number): Promise<T> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      console.warn(`Attempt ${attempt} failed. Retrying...`);
    }
  }
  throw new Error('All retry attempts failed.');
};

export async function fetchNovels(baseUrl: string): Promise<INovel[]> {
  try {
    await checkApiHealth(`${baseUrl}/api/health`, 10, 3000); // Check API health before proceeding
    const response = await retry(() => fetchJSON(`${baseUrl}/api/novels`), 4);
    return response;
  } catch (error) {
    console.error('Error fetching novels:', error);
    return []; // Fallback to an empty array
  }
}

export async function fetchAndSortNovels(baseUrl: string): Promise<INovel[]> {
  try {
    await checkApiHealth(`${baseUrl}/api/health`, 10, 3000); // Check API health before proceeding
    const novels = await retry(() => fetchNovels(baseUrl), 4);
    return novels.sort((a, b) => b.rating - a.rating);
  } catch (error) {
    console.error('Error fetching and sorting novels:', error);
    return []; // Fallback to an empty array
  }
}

export async function fetchNovelById(baseUrl: string, novelId: string): Promise<INovel | null> {
  try {
    await checkApiHealth(`${baseUrl}/api/health`, 10, 3000); // Check API health before proceeding
    const response = await retry(() => fetchJSON(`${baseUrl}/api/novels/${novelId}`), 4);
    return response;
  } catch (error) {
    console.error('Error fetching novel:', error);
    return null; // Fallback to null
  }
}

export async function fetchNewReleases(baseUrl: string): Promise<INovel[]> {
  try {
    await checkApiHealth(`${baseUrl}/api/health`, 10, 3000); // Check API health before proceeding
    const novels = await retry(() => fetchNovels(baseUrl), 4);
    return novels.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
  } catch (error) {
    console.error('Error fetching new releases:', error);
    return []; // Fallback to an empty array
  }
}

export async function fetchMyList(): Promise<INovel[]> {
  try {
    await checkApiHealth(`/api/health`, 10, 3000); // Check API health before proceeding
    const response = await retry(() => fetchJSON("/api/MyList"), 4);
    const myLists: IMyList[] = response;
    return myLists.map((list) => list.novelId as unknown as INovel);
  } catch (error) {
    console.error("Error fetching user collections:", error);
    return [];
  }
}
