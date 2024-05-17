import { IMyList } from "@/models/myList";
import { INovel } from "@/models/novel";

export async function fetchMyList(): Promise<INovel[]> {
  try {
    const response = await fetch("/api/MyList");
    if (response.ok) {
      const myLists: IMyList[] = await response.json();
      return myLists.map((list) => list.novelId as unknown as INovel);
    } else {
      console.error("Error fetching user collections:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching user collections:", error);
    return [];
  }
}
