import NewReleasesClient from '@/components/novels/NewReleasesClient';
import { fetchNewReleases } from '@/lib/FetchNovels';
import { generateNewReleasesMetadata } from '@/lib/GenerateMetadata';
import Head from 'next/head';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const NewReleasesPage = async () => {
  const newReleases = await fetchNewReleases(baseUrl);
  const metadata = await generateNewReleasesMetadata(baseUrl);

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
      </Head>
      <NewReleasesClient newReleases={newReleases} />
    </>
  );
};

export default NewReleasesPage;
