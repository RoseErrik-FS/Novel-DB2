'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { searchNovels } from '@/lib/search';
import NovelCard from '@/components/novels/NovelCard';
import { INovel } from '@/models/novel';
import SearchBar from '@/components/search/SearchBar';

const SearchClient = () => {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const [searchResults, setSearchResults] = useState<INovel[]>([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (q) {
        const results = await searchNovels(q);
        setSearchResults(results);
      }
    };

    fetchSearchResults();
  }, [q]);

  return (
    <div className="container mx-auto max-w-7xl px-6">
      <h1 className="text-2xl font-bold mb-4">Search Novels</h1>
      <SearchBar initialQuery={q || ''} />
      {q && (
        <h2 className="text-xl font-bold mb-4">
          Search Results for "{q}"
        </h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {searchResults.map((novel) => (
          <NovelCard key={novel._id?.toString()} novel={novel} />
        ))}
      </div>
    </div>
  );
};

export default SearchClient;
