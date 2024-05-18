import { fetchAndSortNovels, fetchNovelById, fetchNewReleases } from "@/lib/FetchNovels";
import { IGenre } from "@/models/genre";

export async function generatePopularNovelsMetadata(baseUrl: string) {
  const novels = await fetchAndSortNovels(baseUrl);
  const keywords = novels
    .slice(0, 10)
    .flatMap(novel => [
      novel.title,
      ...novel.authors,
      ...novel.genres.filter((genre): genre is IGenre => (genre as IGenre).name !== undefined).map(genre => (genre as IGenre).name)
    ])
    .join(', ');

  return {
    title: 'Popular Novels',
    description: 'Explore the most popular novels',
    keywords,
  };
}

export async function generateNovelMetadata(baseUrl: string, novelId: string) {
  const novel = await fetchNovelById(baseUrl, novelId);
  if (!novel) {
    return {
      title: 'Novel Not Found',
      description: 'The novel you are looking for does not exist.',
    };
  }

  const keywords = [
    novel.title,
    ...novel.authors,
    ...novel.genres.filter((genre): genre is IGenre => (genre as IGenre).name !== undefined).map(genre => (genre as IGenre).name)
  ].join(', ');

  return {
    title: novel.title,
    description: novel.description,
    keywords,
  };
}

export async function generateNewReleasesMetadata(baseUrl: string) {
  const novels = await fetchNewReleases(baseUrl);
  const keywords = novels
    .flatMap(novel => [
      novel.title,
      ...novel.authors,
      ...novel.genres.filter((genre): genre is IGenre => (genre as IGenre).name !== undefined).map(genre => (genre as IGenre).name)
    ])
    .join(', ');

  return {
    title: 'New Releases',
    description: 'Check out the latest novel releases',
    keywords,
  };
}

export async function generateMyListMetadata() {
  return {
    title: 'My List',
    description: 'Your personal list of favorite novels',
    keywords: 'my list, favorite novels, personal collection',
  };
}

export async function generateAuthMetadata(baseUrl: string) {
  return {
    title: 'Auth Page',
    description: 'Login or register to access your account',
    keywords: 'login, register, authentication',
  };
}
