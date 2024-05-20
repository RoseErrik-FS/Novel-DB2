// app/news/[id]/page.tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import NewsClient from "@/components/news/NewsClient";
import { NewsItemProps } from "@/types/news";

const newsDirectory = path.join(process.cwd(), "content/news");

export async function generateStaticParams() {
  const files = fs.readdirSync(newsDirectory);
  return files.map((fileName) => ({
    id: fileName.replace(/\.mdx?$/, ""),
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const filePath = path.join(newsDirectory, `${params.id}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContents);
  return {
    title: data.title,
    description: data.excerpt,
  };
}

interface NewsPageProps {
  params: {
    id: string;
  };
}

const NewsPage = async ({ params }: NewsPageProps) => {
  const filePath = path.join(newsDirectory, `${params.id}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const mdxSource = await serialize(content);

  const newsData: NewsItemProps = {
    title: data.title,
    image: data.image,
    excerpt: data.excerpt,
    date: data.date,
    author: data.author,
    link: `/news/${params.id}`,
  };

  return <NewsClient data={newsData} content={mdxSource} />;
};

export default NewsPage;
