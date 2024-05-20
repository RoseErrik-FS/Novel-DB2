// app\api\news\route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NewsItemProps } from "@/types/news";

const newsDirectory = path.join(process.cwd(), "content/news");

export async function GET(req: NextRequest) {
  const files = fs.readdirSync(newsDirectory);

  const newsItems = files.map((fileName) => {
    const filePath = path.join(newsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);
    const slug = fileName.replace(/\.mdx?$/, "");
    return {
      title: data.title,
      image: data.image,
      excerpt: data.excerpt,
      date: data.date,
      author: data.author,
      link: `/news/${slug}`,
    } as NewsItemProps;
  });

  return NextResponse.json(newsItems);
}
