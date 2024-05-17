import SearchClient from '@/components/search/SearchClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Novel-DB - Search Novels',
  description: 'Search for your favorite novels',
  keywords: ['novels', 'search', 'books', 'literature'],
};

export default function SearchPage() {
  return <SearchClient />;
}
