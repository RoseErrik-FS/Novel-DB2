// components\homepage\LatestNews.tsx
"use client";

import React from "react";
import { Card, CardBody, Image, Tooltip } from "@nextui-org/react";
import Link from "next/link";

interface NewsItemProps {
  title?: string;
  image?: string;
  excerpt?: string;
  date?: string;
  author?: string;
  link?: string;
}

const LatestNews = ({
  title = "News Post Title Here",
  image = "/test.png",
  excerpt = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  author = "By Author",
  date = "Date",
  link = "/news/latest-item",
}: NewsItemProps) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Card
      isPressable
      isHoverable
      className="mb-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="text-xl font-bold p-2 text-default-800">Latest News</h2>
      <Link href={link}>
        <CardBody className="p-0 pb-5">
          <div className="flex items-center">
            <div className="px-5 pb-4">
              <Image
                src={image}
                width={100}
                height={100}
                alt={title}
                className="object-cover"
              />
            </div>
            <div>
              <Tooltip content={title} isOpen={isHovered}>
                <h4 className="text-lg font-bold text-default-800 truncate max-w-full">
                  {title}
                </h4>
              </Tooltip>
              <p className="text-sm font-medium text-default-600">
                by {author} - {date}
              </p>
            </div>
          </div>
          <div className="text-sm text-default-600 h-20 overflow-hidden px-5 pb-5">
            <p className="">{excerpt}</p>
          </div>
        </CardBody>
      </Link>
    </Card>
  );
};

export default LatestNews;
