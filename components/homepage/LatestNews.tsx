"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, Image, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import axios from "axios";
import { NewsItemProps } from "@/types/news";

const LatestNews: React.FC = () => {
  const [latestNewsItem, setLatestNewsItem] = useState<NewsItemProps | null>(
    null
  );
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchLatestNewsItem = async () => {
      try {
        const response = await axios.get("/api/news");
        const newsItems: NewsItemProps[] = response.data;
        if (newsItems.length > 0) {
          const sortedNewsItems = newsItems.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setLatestNewsItem(sortedNewsItems[0]);
        }
      } catch (error) {
        console.error("Error fetching news items:", error);
      }
    };

    fetchLatestNewsItem();
  }, []);

  const fallbackImage = "/test.png";

  if (!latestNewsItem) {
    return null; // or a loading indicator, or a message saying "No news available"
  }

  return (
    <Card
      isPressable
      isHoverable
      className="mb-2 latest-news-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="text-xl font-bold p-2">Latest News</h2>
      <Link href={`/news/${latestNewsItem.link}`}>
        <CardBody className="p-0 pb-5 latest-news-card-body">
          <div className="flex items-center">
            <div className="px-5 pb-4">
              <Image
                src={latestNewsItem.image || fallbackImage}
                width={100}
                height={100}
                alt={latestNewsItem.title || "No title"}
                className="object-cover"
              />
            </div>
            <div>
              <Tooltip
                content={latestNewsItem.title || "No title"}
                isOpen={isHovered}
              >
                <h4 className="text-lg font-bold text-default-800 truncate max-w-full">
                  {latestNewsItem.title || "No title"}
                </h4>
              </Tooltip>
              <p className="text-sm font-medium text-default-600">
                by {latestNewsItem.author || "Unknown"} -{" "}
                {latestNewsItem.date || "Unknown date"}
              </p>
            </div>
          </div>
          <div className="text-sm text-default-600 latest-news-excerpt">
            <p className="">
              {latestNewsItem.excerpt || "No excerpt available."}
            </p>
          </div>
        </CardBody>
      </Link>
    </Card>
  );
};

export default LatestNews;
