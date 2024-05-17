// app/novels/[novelId]/page.tsx
import NovelDetails from "@/components/novels/NovelDetails";
import AddNovelForm from "@/components/novels/AddNovelForm";
import { fetchNovelById } from "@/lib/FetchNovels";
import { generateNovelMetadata } from "@/lib/GenerateMetadata";
import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function generateMetadata({ params }: { params: { novelId: string } }): Promise<Metadata> {
  const { novelId } = params;

  if (novelId === "new") {
    return {
      title: 'Add New Novel',
    };
  }

  const metadata = await generateNovelMetadata(baseUrl, novelId);
  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
  };
}

const NovelPage = async ({ params }: { params: { novelId: string } }) => {
  const { novelId } = params;

  if (novelId === "new") {
    return <AddNovelForm />;
  }

  const novel = await fetchNovelById(baseUrl, novelId);

  return novel ? <NovelDetails novel={novel} /> : <div>Novel not found.</div>;
};

export default NovelPage;
