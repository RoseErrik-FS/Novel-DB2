// app\news\[id]\page.tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Metadata } from "next";
import { NewsItemProps } from "@/types/news";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

export const dynamic = "force-dynamic";

const newsDirectory = path.join(process.cwd(), "content/news");

export async function generateStaticParams() {
  const files = fs.readdirSync(newsDirectory);
  return files.map((fileName) => ({
    id: fileName.replace(/\.mdx?$/, ""),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
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
  const { serialize } = await import("next-mdx-remote/serialize");
  const { MDXRemote } = await import("next-mdx-remote");
  const mdxSource: MDXRemoteSerializeResult = await serialize(content);

  return (
    <div className="container mx-auto max-w-7xl px-6">
      <h1 className="text-3xl font-bold mb-6">{data.title}</h1>
      <p className="text-sm text-gray-600">
        by {data.author} - {data.date}
      </p>
      <div className="prose">
        <MDXRemote {...mdxSource} />
      </div>
    </div>
  );
};

export default NewsPage;
