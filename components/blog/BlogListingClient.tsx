// components\blog\BlogListingClient.tsx
"use client";

import React from "react";
import Link from "next/link";
import { BlogItemProps } from "@/types/blog";

interface BlogListingClientProps {
  blogItems: BlogItemProps[];
}

const BlogListingClient: React.FC<BlogListingClientProps> = ({ blogItems }) => {
  return (
    <div className="container mx-auto max-w-7xl px-6">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      {blogItems.map((item) => (
        <div key={item.link} className="mb-4">
          <Link href={`/blog/${item.link}`}>
            <h2 className="text-2xl font-bold">{item.title}</h2>
          </Link>
          <p className="text-sm text-gray-600">
            by {item.author} - {item.date}
          </p>
          <p>{item.excerpt}</p>
        </div>
      ))}
    </div>
  );
};

export default BlogListingClient;
