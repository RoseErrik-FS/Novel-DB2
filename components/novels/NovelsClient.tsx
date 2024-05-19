// components\novels\NovelsClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NovelDetails from "@/components/novels/NovelDetails";
import { fetchNovelById } from "@/lib/FetchNovels";
import { INovel } from "@/models/novel";
import { Spinner } from "@nextui-org/react";
import NovelForm from "./NovelForm";
import axios from "axios";
import AuthWrapper from "@/components/Auth/AuthWrapper";

interface NovelClientProps {
  novelId: string;
}

const defaultNovelData = {
  title: "",
  description: "",
  releaseDate: "",
  coverImage: null,
  rating: 0,
  status: "ongoing",
  authors: [],
  publisher: null,
  genres: [],
};

const NovelClient: React.FC<NovelClientProps> = ({ novelId }) => {
  const [novel, setNovel] = useState<INovel | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchNovel = async () => {
      if (novelId === "new") {
        setLoading(false);
        return;
      }

      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const fetchedNovel = await fetchNovelById(baseUrl, novelId);
        if (!fetchedNovel) {
          router.push("/404");
        } else {
          setNovel(fetchedNovel);
        }
      } catch (error) {
        console.error("Error fetching novel:", error);
        router.push("/404");
      } finally {
        setLoading(false);
      }
    };

    fetchNovel();
  }, [novelId, router]);

  const handleNovelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    try {
      if (novelId === "new") {
        await axios.post("/api/novels", data);
      } else {
        await axios.put(`/api/novels/${novelId}`, data);
      }
      router.push("/novels");
    } catch (error) {
      console.error("Error saving novel:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (novelId === "new") {
    return (
      <AuthWrapper>
        <NovelForm
          initialData={defaultNovelData}
          onSubmit={handleNovelSubmit}
        />
      </AuthWrapper>
    );
  }

  return novel ? <NovelDetails novel={novel} /> : <div>Novel not found.</div>;
};

export default NovelClient;
