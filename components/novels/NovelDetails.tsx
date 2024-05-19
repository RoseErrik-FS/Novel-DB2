// components\novels\NovelDetails.tsx
"use client";

import React, { useState, useEffect } from "react";
import { INovel } from "@/models/novel";
import {
  Card,
  Image,
  Divider,
  CardBody,
  CardHeader,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { IGenre } from "@/models/genre";
import { useSession } from "next-auth/react";
import axios from "axios";

interface NovelDetailsProps {
  novel: INovel | null;
}

const NovelDetails: React.FC<NovelDetailsProps> = ({ novel }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [inMyList, setInMyList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkMyList = async () => {
      if (status === "authenticated" && session?.user && novel) {
        try {
          const response = await axios.get(`/api/MyList`);
          const myList = response.data;
          setInMyList(myList.some((item: any) => item.novelId === novel._id));
        } catch (error) {
          console.error("Error checking my list:", error);
        }
      }
    };

    checkMyList();
  }, [status, session, novel]);

  const handleEditClick = () => {
    if (novel) {
      router.push(`/novels/${novel._id}/edit`);
    }
  };

  const handleMyListToggle = async () => {
    if (!session?.user || !novel) return;
    setIsLoading(true);
    try {
      if (inMyList) {
        await axios.delete(`/api/MyList`, { data: { novelId: novel._id } });
      } else {
        await axios.post("/api/MyList", {
          novelId: novel._id,
          collectionName: "My List",
        });
      }
      setInMyList(!inMyList);
    } catch (error) {
      console.error("Error updating my list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!novel) {
    return <div>Novel not found.</div>;
  }

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">{novel.title}</h2>
          {status === "authenticated" && (
            <div className="flex ml-auto space-x-2">
              <Button onClick={handleMyListToggle} disabled={isLoading}>
                {isLoading
                  ? "Loading..."
                  : inMyList
                  ? "Remove from My List"
                  : "Add to My List"}
              </Button>
              <Button onClick={handleEditClick}>Edit Novel</Button>
            </div>
          )}
        </CardHeader>
        <Divider className="my-4" />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Image
                src={novel.coverImage ?? "/test.png"}
                alt={novel.title}
                width={200}
                height={300}
              />
            </div>
            <div>
              <p className="text-base">{novel.description}</p>
              <Divider className="my-2" />
              <p className="text-sm text-gray-500">
                Authors:{" "}
                {novel.authors
                  .map((author) => "name" in author && author.name)
                  .join(", ")}
              </p>
              <p className="text-sm text-gray-500">
                Release Date: {new Date(novel.releaseDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">Status: {novel.status}</p>
              {novel.publisher && "name" in novel.publisher && (
                <p className="text-sm text-gray-500">
                  Publisher: {novel.publisher.name}
                </p>
              )}
              <p className="text-sm text-gray-500">
                Genres:{" "}
                {novel.genres
                  .filter((genre): genre is IGenre => "name" in genre)
                  .map((genre) => genre.name)
                  .join(", ")}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default NovelDetails;
