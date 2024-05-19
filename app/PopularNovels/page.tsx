// app\PopularNovels\page.tsx
import PopularNovelsClient from "@/components/novels/PopularNovelsClient";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Popular Novels",
  description: "Explore the most popular novels",
  keywords: "popular, novels, books, literature",
};

const PopularNovelsPage = () => {
  return <PopularNovelsClient initialNovels={[]} />;
};

export default PopularNovelsPage;
