"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, Image, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import axios from "axios";
import { BlogItemProps } from "@/types/blog";

const LatestBlogPost: React.FC = () => {
  const [latestBlogItem, setLatestBlogItem] = useState<BlogItemProps | null>(
    null
  );
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchLatestBlogItem = async () => {
      try {
        const response = await axios.get("/api/blog");
        const blogItems: BlogItemProps[] = response.data;
        if (blogItems.length > 0) {
          const sortedBlogItems = blogItems.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setLatestBlogItem(sortedBlogItems[0]);
        }
      } catch (error) {
        console.error("Error fetching blog items:", error);
      }
    };

    fetchLatestBlogItem();
  }, []);

  const fallbackImage = "/test.png";

  if (!latestBlogItem) {
    return null; // or a loading indicator, or a message saying "No blog available"
  }

  return (
    <Card
      isPressable
      isHoverable
      className="mb-2 latest-blog-post-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="text-xl font-bold p-2">Latest Blog Post</h2>
      <Link href={`/blog/${latestBlogItem.link}`}>
        <CardBody className="p-0 pb-5 latest-blog-post-card-body">
          <div className="flex items-center">
            <div className="px-5 pb-4">
              <Image
                src={latestBlogItem.image || fallbackImage}
                width={100}
                height={100}
                alt={latestBlogItem.title || "No title"}
                className="object-cover"
              />
            </div>
            <div>
              <Tooltip
                content={latestBlogItem.title || "No title"}
                isOpen={isHovered}
              >
                <h4 className="text-lg font-bold text-default-800 truncate max-w-full">
                  {latestBlogItem.title || "No title"}
                </h4>
              </Tooltip>
              <p className="text-sm font-medium text-default-600">
                by {latestBlogItem.author || "Unknown"} -{" "}
                {latestBlogItem.date || "Unknown date"}
              </p>
            </div>
          </div>
          <div className="text-sm text-default-600 latest-blog-excerpt">
            <p className="">
              {latestBlogItem.excerpt || "No excerpt available."}
            </p>
          </div>
        </CardBody>
      </Link>
    </Card>
  );
};

export default LatestBlogPost;
