import PopularNovelsClient from '@/components/novels/PopularNovelsClient';
import { fetchAndSortNovels } from '@/lib/FetchNovels';
import { generatePopularNovelsMetadata } from '@/lib/GenerateMetadata';
import Head from 'next/head';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const PopularNovelsPage = async () => {
  const initialNovels = await fetchAndSortNovels(baseUrl);
  const metadata = await generatePopularNovelsMetadata(baseUrl);

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
      </Head>
      <PopularNovelsClient initialNovels={initialNovels} />
    </>
  );
};

export default PopularNovelsPage;
