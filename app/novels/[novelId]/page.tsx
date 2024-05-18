// app/novels/[novelId]/page.tsx
import { notFound } from 'next/navigation';
import NovelDetails from "@/components/novels/NovelDetails";
import AddNovelForm from "@/components/novels/AddNovelForm";
import { fetchNovelById } from "@/lib/FetchNovels";
import { generateNovelMetadata } from "@/lib/GenerateMetadata";
import { INovel } from '@/models/novel';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

interface NovelPageProps {
  params: {
    novelId: string;
  };
}

export async function generateMetadata({ params }: NovelPageProps) {
  const { novelId } = params;
  if (novelId === "new") {
    return {
      title: 'Add New Novel',
    };
  }

  try {
    const metadata = await generateNovelMetadata(baseUrl, novelId);
    return metadata;
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Novel not found',
    };
  }
}

const NovelPage = async ({ params }: NovelPageProps) => {
  const { novelId } = params;

  if (novelId === "new") {
    return <AddNovelForm />;
  }

  try {
    const novel = await fetchNovelById(baseUrl, novelId);
    if (!novel) {
      notFound();
    }

    return <NovelDetails novel={novel} />;
  } catch (error) {
    console.error('Error fetching novel:', error);
    notFound();
  }
};

export default NovelPage;
