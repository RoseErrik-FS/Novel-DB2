// app\api\blog\route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogItemProps } from "@/types/blog";
import { handleErrorResponse } from "@/lib/errorHandler"; // Import the error handler

export const dynamic = "force-dynamic";

const blogDirectory = path.join(process.cwd(), "content/blog");

export async function GET(req: NextRequest) {
  try {
    const files = fs.readdirSync(blogDirectory);

    const blogItems = files.map((fileName) => {
      const filePath = path.join(blogDirectory, fileName);
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
      } as BlogItemProps;
    });

    return NextResponse.json(blogItems);
  } catch (error) {
    console.error("Failed to retrieve blog items:", error);
    return handleErrorResponse(error); // Use the error handler
  }
}
