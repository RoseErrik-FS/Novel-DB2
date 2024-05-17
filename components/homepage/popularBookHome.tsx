"use client";

import React, { useState, useEffect } from "react";
import NextLink from 'next/link';
import { Button } from "@nextui-org/react";
import { INovel } from '@/models/novel';
import NovelCard from "../novels/NovelCard";

const PopularNovels = () => {
  const [novels, setNovels] = useState<INovel[]>([]);

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const response = await fetch('/api/novels');
        const data = await response.json();
        const sortedNovels = data.sort((a: INovel, b: INovel) => b.rating - a.rating);
        setNovels(sortedNovels.slice(0, 8));
      } catch (error) {
        console.error('Error fetching novels:', error);
      }
    };
  
    fetchNovels();
  }, []);

  const visibleNovels = novels.slice(0, 4);

  return (
    <div className="bg-default-100 p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-default-800">Popular Novels</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {visibleNovels.map((novel) => (
          <NovelCard key={novel._id?.toString()} novel={novel} />
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <NextLink href="/PopularNovels">
          <Button>View All Popular Novels</Button>
        </NextLink>
      </div>
    </div>
  );
};

export default PopularNovels;