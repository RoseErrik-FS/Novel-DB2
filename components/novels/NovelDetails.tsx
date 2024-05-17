"use client";

import React from "react";
import { INovel } from "@/models/novel";
import { Card, Image, Divider, CardBody, CardHeader } from "@nextui-org/react";
import { IGenre } from "@/models/genre";

interface NovelDetailsProps {
  novel: INovel | null;
}

const NovelDetails: React.FC<NovelDetailsProps> = ({ novel }) => {
  if (!novel) {
    return <div>Novel not found.</div>;
  }

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">{novel.title}</h2>
        </CardHeader>
        <Divider className="my-4" />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Image
                src={novel.coverImage ?? "/test.png"}
                alt={novel.title}
                width={200}
                height={300}
              />
            </div>
            <div>
              <p className="text-base">{novel.description}</p>
              <Divider className="my-2" />
              <p className="text-sm text-gray-500">
                Release Date: {new Date(novel.releaseDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">Status: {novel.status}</p>
              {novel.publisher && "name" in novel.publisher && (
                <p className="text-sm text-gray-500">
                  Publisher: {novel.publisher.name}
                </p>
              )}
              <p className="text-sm text-gray-500">
                Genres:{" "}
                {novel.genres
                  .filter((genre): genre is IGenre => "name" in genre)
                  .map((genre) => genre.name)
                  .join(", ")}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default NovelDetails;
