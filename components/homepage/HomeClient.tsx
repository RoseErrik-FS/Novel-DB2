'use client';

import React, { useState, useEffect } from 'react';
import CurrentReleaseNovels from "@/components/homepage/newBookHome";
import PopularNovels from "@/components/homepage/popularBookHome";
import LatestBlogPost from "@/components/homepage/LatestBlogPost";
import LatestNews from "@/components/homepage/LatestNews";
import MyList from "@/components/homepage/myList";
import { INovel } from "@/models/novel";
import { fetchMyList } from '@/lib/FetchNovels';
import { Spinner } from '@nextui-org/react';

interface HomeClientProps {
  initialUserCollections: INovel[];
}

export default function HomeClient({ initialUserCollections }: HomeClientProps) {
  const [userCollections, setUserCollections] = useState<INovel[]>(initialUserCollections);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserCollections = async () => {
      setLoading(true);
      try {
        const collections = await fetchMyList();
        setUserCollections(collections);
      } catch (error) {
        console.error('Error fetching user collections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCollections();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }

  return (
    <div className="container mx-auto max-w-7xl px-6">
      <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 mb-2">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/2">
            <LatestBlogPost />
          </div>
          <div className="md:w-1/2">
            <LatestNews />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 mt-2">
        <CurrentReleaseNovels />
      </div>

      <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 mt-2">
        <PopularNovels />
      </div>

      <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 mt-2">
        <MyList userCollections={userCollections} />
      </div>
    </div>
  );
}
