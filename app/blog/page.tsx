// app\blog\page.tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogItemProps } from "@/types/blog";
import BlogListingClient from "@/components/blog/BlogListingClient";

const blogDirectory = path.join(process.cwd(), "content/blog");

const BlogListingPage = async () => {
  const files = fs.readdirSync(blogDirectory);

  const blogItems = files.map((fileName) => {
    const filePath = path.join(blogDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    return {
      title: data.title,
      image: data.image,
      excerpt: data.excerpt,
      date: data.date,
      author: data.author,
      link: fileName.replace(/\.mdx?$/, ""),
    } as BlogItemProps;
  });

  return <BlogListingClient blogItems={blogItems} />;
};

export default BlogListingPage;
