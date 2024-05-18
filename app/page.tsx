import HomeClient from '@/components/homepage/HomeClient';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Novel-DB - Home Page',
  description: 'Welcome to the home page',
  keywords: 'novels, home, books, literature',
};

const Home = () => {
  return <HomeClient initialUserCollections={[]} />;
};

export default Home;
