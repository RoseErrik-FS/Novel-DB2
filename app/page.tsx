import Head from 'next/head';
import HomeClient from '@/components/homepage/HomeClient';
import { fetchNovels } from '@/lib/FetchNovels';

export const metadata = {
  title: 'Novel-DB - Home Page',
  description: 'Welcome to the home page',
};

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const userCollections = await fetchNovels(baseUrl);

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        {/* Add more meta tags here if needed */}
      </Head>
      <HomeClient userCollections={userCollections} />
    </>
  );
}
