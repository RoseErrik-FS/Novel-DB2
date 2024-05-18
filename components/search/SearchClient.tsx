'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { searchNovels } from '@/lib/search';
import NovelCard from '@/components/novels/NovelCard';
import { INovel } from '@/models/novel';
import SearchBar from '@/components/search/SearchBar';
import { checkApiHealth } from '@/lib/health';
import { Spinner } from '@nextui-org/react';

const SearchClient = () => {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const [searchResults, setSearchResults] = useState<INovel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiReady, setApiReady] = useState(false);
  const [apiLoading, setApiLoading] = useState(true);

  useEffect(() => {
    const checkApi = async () => {
      try {
        await checkApiHealth('/api/health', 10, 3000);
        setApiReady(true);
      } catch (error) {
        console.error('API is not ready:', error);
      } finally {
        setApiLoading(false);
      }
    };

    checkApi();
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (q) {
        setLoading(true);
        setError('');
        try {
          const results = await searchNovels(q);
          setSearchResults(results);
        } catch (err) {
          setError('Failed to fetch search results');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSearchResults();
  }, [q]);

  if (apiLoading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }

  if (!apiReady) {
    return <div className="flex justify-center items-center h-screen">API is not available. Please try again later.</div>;
  }

  return (
    <div className="container mx-auto max-w-7xl px-6">
      <h1 className="text-2xl font-bold mb-4">Search Novels</h1>
      <SearchBar initialQuery={q || ''} />
      {q && (
        <h2 className="text-xl font-bold mb-4">
          Search Results for &quot;{q}&quot;
        </h2>
      )}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {searchResults.map((novel) => (
          <NovelCard key={novel._id?.toString()} novel={novel} />
        ))}
      </div>
    </div>
  );
};

export default SearchClient;
