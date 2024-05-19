import { Metadata } from 'next';
import NovelEditClient from '@/components/novels/NovelEditClient';
import { fetchNovelById } from '@/lib/FetchNovels';

interface EditNovelPageProps {
  params: {
    novelId: string;
  };
}

export const generateMetadata = async ({ params }: EditNovelPageProps): Promise<Metadata> => {
  const { novelId } = params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  console.log('Generating metadata for novelId:', novelId);

  try {
    const novel = await fetchNovelById(baseUrl, novelId);
    console.log('Fetched novel:', novel);

    if (!novel) {
      throw new Error('Novel not found');
    }
    return {
      title: `Edit ${novel.title}`,
      description: `Edit details for ${novel.title}`,
    };
  } catch (error) {
    console.error('Failed to fetch novel metadata:', error);
    return {
      title: 'Novel not found',
      description: 'The novel you are trying to edit does not exist.',
    };
  }
};

const isPublisherObject = (publisher: any): publisher is { name: string } => {
  return publisher && typeof publisher === 'object' && 'name' in publisher;
};

const EditNovelPage = async ({ params }: EditNovelPageProps) => {
  const { novelId } = params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  console.log('Loading EditNovelPage for novelId:', novelId);

  try {
    const novel = await fetchNovelById(baseUrl, novelId);
    console.log('Fetched novel:', novel);

    if (!novel) {
      throw new Error('Novel not found');
    }

    const releaseDate = new Date(novel.releaseDate);
    if (isNaN(releaseDate.getTime())) {
      throw new Error('Invalid release date');
    }

    const initialData = {
      title: novel.title,
      description: novel.description,
      releaseDate: releaseDate.toISOString(),
      coverImage: novel.coverImage || null,
      rating: novel.rating,
      status: novel.status,
      authors: novel.authors.map((author: any) => ({ value: author.name, label: author.name })),
      publisher: isPublisherObject(novel.publisher) ? { value: novel.publisher.name, label: novel.publisher.name } : null,
      genres: novel.genres.map((genre: any) => ({ value: genre.name, label: genre.name })),
    };

    console.log('Initial data for NovelEditClient:', initialData);

    return <NovelEditClient initialData={initialData} novelId={novelId} />;
  } catch (error) {
    console.error('Failed to fetch novel', error);
    return <div>Novel not found.</div>;
  }
};

export default EditNovelPage;
