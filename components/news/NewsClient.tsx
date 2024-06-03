// components\news\NewsClient.tsx
"use client";

import React from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { NewsItemProps } from "@/types/news";

interface NewsClientProps {
  data: NewsItemProps;
  content: MDXRemoteSerializeResult;
}

const NewsClient: React.FC<NewsClientProps> = ({ data, content }) => {
  return (
    <div className="container mx-auto max-w-7xl px-6">
      <h1 className="text-3xl font-bold mb-6">{data.title}</h1>
      <p className="text-sm text-gray-600">
        by {data.author} - {data.date}
      </p>
      <div className="prose">
        <MDXRemote {...content} />
      </div>
    </div>
  );
};

export default NewsClient;
