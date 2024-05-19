import { IMyList } from "@/models/myList";
import { INovel } from "@/models/novel";

// Improved fetchJSON with enhanced error handling
const fetchJSON = async (url: string): Promise<any> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch ${url}: ${response.status} - ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in fetchJSON: ${error.message}`);
    } else {
      console.error(`Unknown error in fetchJSON: ${String(error)}`);
    }
    throw error;
  }
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
  if (process.env.NEXT_PUBLIC_API_READY !== 'true') {
    return []; // Return fallback data if the API is not ready
  }
  try {
    const response = await retry(() => fetchJSON(`${baseUrl}/api/novels`), 4);
    return response;
  } catch (error) {
    console.error('Error fetching novels:', error);
    return []; // Fallback to an empty array
  }
}

export async function fetchAndSortNovels(baseUrl: string): Promise<INovel[]> {
  const novels = await fetchNovels(baseUrl);
  return novels.sort((a, b) => b.rating - a.rating);
}

export async function fetchNovelById(baseUrl: string, novelId: string): Promise<INovel | null> {
  if (process.env.NEXT_PUBLIC_API_READY !== 'true') {
    return null; // Return fallback data if the API is not ready
  }
  try {
    const response = await retry(() => fetchJSON(`${baseUrl}/api/novels/${novelId}`), 4);
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching novel:', error.message);
    } else {
      console.error('Unknown error fetching novel:', String(error));
    }
    return null; // Fallback to null
  }
}

export async function fetchNewReleases(baseUrl: string): Promise<INovel[]> {
  const novels = await fetchNovels(baseUrl);
  return novels.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
}

export async function fetchMyList(): Promise<INovel[]> {
  if (process.env.NEXT_PUBLIC_API_READY !== 'true') {
    return []; // Return fallback data if the API is not ready
  }
  try {
    const response = await retry(() => fetchJSON("/api/MyList"), 4);
    const myLists: IMyList[] = response;
    return myLists.map((list) => list.novelId as unknown as INovel);
  } catch (error) {
    console.error("Error fetching user collections:", error);
    return [];
  }
}
