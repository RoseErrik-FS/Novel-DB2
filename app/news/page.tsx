// app/news/page.tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import NewsListingClient from "@/components/news/NewsListingClient";
import { NewsItemProps } from "@/types/news";

const newsDirectory = path.join(process.cwd(), "content/news");

const NewsListingPage = async () => {
  const files = fs.readdirSync(newsDirectory);

  const newsItems = files.map((fileName) => {
    const filePath = path.join(newsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    return {
      title: data.title,
      image: data.image,
      excerpt: data.excerpt,
      date: data.date,
      author: data.author,
      link: fileName.replace(/\.mdx?$/, ""),
    } as NewsItemProps;
  });

  return <NewsListingClient newsItems={newsItems} />;
};

export default NewsListingPage;
