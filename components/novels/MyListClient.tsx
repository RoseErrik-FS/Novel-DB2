'use client';

import React, { useState, useEffect } from "react";
import { INovel } from '@/models/novel';
import NovelCard from "@/components/novels/NovelCard";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { fetchMyList } from '@/lib/FetchMyList';
import { Spinner } from "@nextui-org/react";

interface MyListClientProps {
  initialNovels: INovel[];
}

const MyListClient: React.FC<MyListClientProps> = ({ initialNovels }) => {
  const { data: session, status } = useSession();
  const [userCollections, setUserCollections] = useState<INovel[]>(initialNovels);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCollections = async () => {
      if (status === "authenticated") {
        const novels = await fetchMyList();
        setUserCollections(novels);
      }
      setLoading(false);
    };

    fetchUserCollections();
  }, [status, session]);

  const pathname = usePathname();

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }

  return (
    <div className="container mx-auto max-w-7xl px-6">
      <div className="bg-default-100 p-4 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-default-800">My List</h2>
        {status === "authenticated" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {userCollections.map((novel) => (
              <NovelCard key={novel._id?.toString()} novel={novel} />
            ))}
          </div>
        ) : (
          <p className="text-default-600">
            Please{" "}
            <a href={`/Auth?form=login&callbackUrl=${encodeURIComponent(pathname)}`} className="text-primary-600 hover:text-primary-800">
              log in
            </a>{" "}
            to view your list.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyListClient;
