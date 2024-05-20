// app\blog\[id]\page.tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import BlogClient from "@/components/blog/BlogClient";
import { BlogItemProps } from "@/types/blog";

const blogDirectory = path.join(process.cwd(), "content/blog");

export async function generateStaticParams() {
  const files = fs.readdirSync(blogDirectory);
  return files.map((fileName) => ({
    id: fileName.replace(/\.mdx?$/, ""),
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
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
  const mdxSource = await serialize(content);

  const blogData: BlogItemProps = {
    title: data.title,
    image: data.image,
    excerpt: data.excerpt,
    date: data.date,
    author: data.author,
    link: `/blog/${params.id}`,
  };

  return <BlogClient data={blogData} content={mdxSource} />;
};

export default BlogPage;
