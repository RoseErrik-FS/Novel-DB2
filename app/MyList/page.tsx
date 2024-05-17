import MyListClient from '@/components/novels/MyListClient';
import { fetchMyList } from '@/lib/FetchMyList';
import { generateMyListMetadata } from '@/lib/GenerateMetadata';
import Head from 'next/head';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const MyListPage = async () => {
  const initialNovels = await fetchMyList();
  const metadata = await generateMyListMetadata();

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
      </Head>
      <MyListClient initialNovels={initialNovels} />
    </>
  );
};

export default MyListPage;
