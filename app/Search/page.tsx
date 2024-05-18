import { Suspense } from 'react';
import SearchClient from '@/components/search/SearchClient';
import { Metadata } from 'next';
import { Spinner } from '@nextui-org/react';

export const metadata: Metadata = {
  title: 'Novel-DB - Search Novels',
  description: 'Search for your favorite novels',
  keywords: ['novels', 'search', 'books', 'literature'],
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Spinner /></div>}>
      <SearchClient />
    </Suspense>
  );
}
