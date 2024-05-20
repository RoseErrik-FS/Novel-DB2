// components\novels\NovelEditClient.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import NovelForm from "@/components/novels/NovelForm";
import { OptionType } from "@/types/types";
import AuthWrapper from "../Auth/AuthWrapper";

interface NovelEditClientProps {
  initialData: {
    _id?: string;
    title: string;
    description: string;
    releaseDate: string;
    coverImage: string | null;
    rating: number;
    status: string;
    authors: OptionType[];
    publisher: OptionType | null;
    genres: OptionType[];
  };
  novelId: string;
}

const isPublisherObject = (publisher: any): publisher is { name: string } => {
  return publisher && typeof publisher === "object" && "name" in publisher;
};

const NovelEditClient = ({ initialData, novelId }: NovelEditClientProps) => {
  const router = useRouter();
  const [novelData, setNovelData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const updateNovelData = useCallback(
    async (novelId: string) => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/novels/${novelId}`);
        const novel = response.data;
        if (!novel) {
          throw new Error("Novel not found");
        }
        setNovelData({
          _id: novel._id,
          title: novel.title,
          description: novel.description,
          releaseDate: new Date(novel.releaseDate).toISOString(), // Ensure it's a string
          coverImage: novel.coverImage || null,
          rating: novel.rating,
          status: novel.status,
          authors: novel.authors.map((author: any) => ({
            value: author.name,
            label: author.name,
          })),
          publisher: isPublisherObject(novel.publisher)
            ? { value: novel.publisher.name, label: novel.publisher.name }
            : null,
          genres: novel.genres.map((genre: any) => ({
            value: genre.name,
            label: genre.name,
          })),
        });
      } catch (error) {
        console.error("Failed to fetch novel", error);
        router.push("/404");
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    updateNovelData(novelId);
  }, [novelId, updateNovelData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!novelData) {
    return <div>Novel not found.</div>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(`/api/novels/${novelId}`, {
        ...novelData,
        authors: novelData.authors.map((option) => option.value),
        genres: novelData.genres.map((option) => option.value),
        publisher: novelData.publisher ? novelData.publisher.value : null,
      });
      router.push(`/novels/${novelId}`); // Redirect to the updated novel's page
    } catch (error) {
      console.error("Failed to update novel", error);
    }
  };

  return (
    <AuthWrapper>
      <NovelForm initialData={novelData} onSubmit={handleSubmit} />
    </AuthWrapper>
  );
};

export default NovelEditClient;
