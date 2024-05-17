'use client';

import React, { useState, useEffect } from 'react';
import { Pagination } from "@nextui-org/pagination";
import NovelCard from '@/components/novels/NovelCard';
import { INovel } from '@/models/novel';

interface PopularNovelsClientProps {
  initialNovels: INovel[];
}

const PopularNovelsClient = ({ initialNovels }: PopularNovelsClientProps) => {
  const [novels, setNovels] = useState<INovel[]>(initialNovels);
  const [currentPage, setCurrentPage] = useState(1);
  const [novelsPerPage] = useState(20);

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const response = await fetch('/api/novels');
        const data = await response.json();
        const sortedNovels = data.sort((a: INovel, b: INovel) =>
          b.rating - a.rating
        );
        setNovels(sortedNovels);
      } catch (error) {
        console.error('Error fetching novels:', error);
      }
    };

    fetchNovels();
  }, []);

  const indexOfLastNovel = currentPage * novelsPerPage;
  const indexOfFirstNovel = indexOfLastNovel - novelsPerPage;
  const currentNovels = novels.slice(indexOfFirstNovel, indexOfLastNovel);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto max-w-7xl px-6">
      <div className="bg-default-100 p-4 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-default-800">Popular Novels</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {currentNovels.map((novel) => (
            <NovelCard key={novel._id?.toString()} novel={novel} />
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Pagination
            showControls
            total={Math.ceil(novels.length / novelsPerPage)}
            initialPage={1}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PopularNovelsClient;
