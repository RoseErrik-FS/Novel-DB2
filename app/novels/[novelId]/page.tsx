import NovelClient from '@/components/novels/NovelsClient';
import { generateNovelMetadata } from '@/lib/GenerateMetadata';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

interface NovelPageProps {
  params: {
    novelId: string;
  };
}

export async function generateMetadata({ params }: NovelPageProps): Promise<Metadata> {
  const { novelId } = params;
  if (novelId === 'new') {
    return {
      title: 'Add New Novel',
      description: 'Add a new novel to the collection.',
      keywords: 'add, novel, new',
    };
  }

  try {
    const metadata = await generateNovelMetadata(baseUrl, novelId);
    return metadata;
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Novel not found',
      description: 'The novel you are looking for does not exist.',
      keywords: 'novel, not found',
    };
  }
}

const NovelPage = ({ params }: NovelPageProps) => {
  const { novelId } = params;
  return <NovelClient novelId={novelId} />;
};

export default NovelPage;
