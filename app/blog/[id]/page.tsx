// app\blog\[id]\page.tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Metadata } from "next";
import { BlogItemProps } from "@/types/blog";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

export const dynamic = "force-dynamic";

const blogDirectory = path.join(process.cwd(), "content/blog");

export async function generateStaticParams() {
  const files = fs.readdirSync(blogDirectory);
  return files.map((fileName) => ({
    id: fileName.replace(/\.mdx?$/, ""),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const filePath = path.join(blogDirectory, `${params.id}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContents);
  return {
    title: data.title,
    description: data.excerpt,
  };
}

interface BlogPageProps {
  params: {
    id: string;
  };
}

const BlogPage = async ({ params }: BlogPageProps) => {
  const filePath = path.join(blogDirectory, `${params.id}.mdx`);
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

export default BlogPage;
