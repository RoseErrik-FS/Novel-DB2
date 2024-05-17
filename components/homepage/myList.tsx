"use client"
import React, { useState, useEffect } from "react";
import NextLink from 'next/link';
import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { INovel } from '@/models/novel';
import NovelCard from "../novels/NovelCard";
import { usePathname } from "next/navigation";

type MyListProps = {
  userCollections: INovel[];
};

const MyList: React.FC<MyListProps> = ({ userCollections }) => {
  const { status } = useSession();
  const [visibleUserCollections, setVisibleUserCollections] = useState<INovel[]>([]);

  useEffect(() => {
    setVisibleUserCollections(userCollections.slice(0, 4));
  }, [userCollections]);

  if (status !== "authenticated") {
    return (
      <div className="bg-default-100 p-4 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-default-800">My List</h2>
        <p className="text-default-600">
          Please{" "}
          <NextLink href={`/Auth?form=login&callbackUrl=${encodeURIComponent(usePathname())}`}>
            Login
          </NextLink>{" "}
          to view your list.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-default-100 p-4">
      <h2 className="text-2xl font-bold mb-4 text-default-800">My List</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {visibleUserCollections.map((novel) => (
          <NovelCard key={novel._id?.toString()} novel={novel} />
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <NextLink href="/MyList">
          <Button>View All My List</Button>
        </NextLink>
      </div>
    </div>
  );
};

export default MyList;