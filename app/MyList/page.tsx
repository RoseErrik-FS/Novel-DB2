// app\MyList\page.tsx
import MyListClient from "@/components/novels/MyListClient";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My List",
  description: "Your personal list of favorite novels",
  keywords: "my list, favorite novels, personal collection",
};

const MyListPage = () => {
  return <MyListClient initialNovels={[]} />;
};

export default MyListPage;
