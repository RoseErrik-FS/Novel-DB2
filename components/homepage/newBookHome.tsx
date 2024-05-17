"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import NovelCard from '../novels/NovelCard';
import { INovel } from '@/models/novel';

const CurrentReleaseNovels = () => {
  const [novels, setNovels] = useState<INovel[]>([]);
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const response = await fetch('/api/novels');
        const data = await response.json();
        const sortedNovels = data.sort((a: INovel, b: INovel) =>
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        );
        setNovels(sortedNovels);
      } catch (error) {
        console.error('Error fetching novels:', error);
      }
    };
  
    fetchNovels();
  }, []);

  const visibleNovels = novels.slice(0, 4);

  return (
    <div className="bg-default-100 p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-default-800">Current Releases</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {visibleNovels.map((novel) => (
          <NovelCard key={novel._id?.toString()} novel={novel} />
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <NextLink href="/NewReleases">
          <Button>View All New Releases</Button>
        </NextLink>
      </div>
    </div>
  );
};

export default CurrentReleaseNovels;