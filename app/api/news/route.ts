// app\api\news\route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NewsItemProps } from "@/types/news";
import { handleErrorResponse } from "@/lib/errorHandler"; // Import the error handler

export const dynamic = "force-dynamic";

const newsDirectory = path.join(process.cwd(), "content/news");

export async function GET(req: NextRequest) {
  try {
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
        link: `${slug}`,
      } as NewsItemProps;
    });

    return NextResponse.json(newsItems);
  } catch (error) {
    console.error("Failed to retrieve news items:", error);
    return handleErrorResponse(error); // Use the error handler
  }
}
