import { GetServerSideProps } from 'next';
import NovelDetails from "@/components/novels/NovelDetails";
import AddNovelForm from "@/components/novels/AddNovelForm";
import { fetchNovelById } from "@/lib/FetchNovels";
import { generateNovelMetadata } from "@/lib/GenerateMetadata";
import { INovel } from '@/models/novel';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

interface NovelPageProps {
  novel?: INovel;
  novelId: string;
  metadata: {
    title: string;
    description?: string;
    keywords?: string;
  };
}

const NovelPage = ({ novel, novelId, metadata }: NovelPageProps) => {
  if (novelId === "new") {
    return <AddNovelForm />;
  }

  return novel ? (
    <NovelDetails novel={novel} />
  ) : (
    <div>Novel not found.</div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { novelId } = context.params as { novelId: string };

  if (novelId === "new") {
    return {
      props: {
        novelId,
        metadata: {
          title: 'Add New Novel',
        },
      },
    };
  }

  try {
    const novel = await fetchNovelById(baseUrl, novelId);
    const metadata = await generateNovelMetadata(baseUrl, novelId);

    return {
      props: {
        novel,
        novelId,
        metadata,
      },
    };
  } catch (error) {
    console.error('Error fetching novel or metadata:', error);
    return {
      props: {
        novel: null,
        novelId,
        metadata: {
          title: 'Novel not found',
        },
      },
    };
  }
};

export default NovelPage;
