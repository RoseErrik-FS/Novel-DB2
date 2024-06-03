// components\news\NewsListingClient.tsx
"use client";

import React from "react";
import Link from "next/link";
import { NewsItemProps } from "@/types/news";

interface NewsListingClientProps {
  newsItems: NewsItemProps[];
}

const NewsListingClient: React.FC<NewsListingClientProps> = ({ newsItems }) => {
  return (
    <div className="container mx-auto max-w-7xl px-6">
      <h1 className="text-3xl font-bold mb-6">News</h1>
      {newsItems.map((item) => (
        <div key={item.link} className="mb-4">
          <Link href={`/news/${item.link}`}>
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

export default NewsListingClient;
