// lib\FetchMyList.ts
import { IMyList } from "@/models/myList";
import { INovel } from "@/models/novel";

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
  throw new Error("All retry attempts failed.");
};

export async function fetchMyList(): Promise<INovel[]> {
  try {
    const response = await retry(() => fetchJSON("/api/MyList"), 4);
    const myLists: IMyList[] = response;
    return myLists.map((list) => list.novelId as unknown as INovel);
  } catch (error) {
    console.error("Error fetching user collections:", error);
    return [];
  }
}
