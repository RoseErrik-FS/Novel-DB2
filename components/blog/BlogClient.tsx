// components\blog\BlogClient.tsx
"use client";

import React from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { BlogItemProps } from "@/types/blog";

interface BlogClientProps {
  data: BlogItemProps;
  content: MDXRemoteSerializeResult;
}

const BlogClient: React.FC<BlogClientProps> = ({ data, content }) => {
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

export default BlogClient;
