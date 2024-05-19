// components\novels\NovelCard.tsx
import React, { useState } from "react";
import { Card, CardBody, CardFooter, Image, Tooltip } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { INovel } from "@/models/novel";

interface NovelCardProps {
  novel: INovel;
}

const NovelCard: React.FC<NovelCardProps> = ({ novel }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    router.push(`/novels/${novel._id?.toString()}`);
  };

  return (
    <Card
      isPressable
      isHoverable
      className="mb-4"
      onPress={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardBody className="p-0">
        <Image
          src={novel.coverImage ?? "/test.png"}
          alt={novel.title}
          width="100%"
          height={200}
          className="object-cover"
        />
      </CardBody>
      <CardFooter className="justify-items-start py-8 gap-4">
        <div className="flex flex-col items-start">
          <Tooltip content={novel.title} isOpen={isHovered}>
            <h3 className="text-lg font-bold text-default-800 truncate max-w-full">
              {novel.title}
            </h3>
          </Tooltip>
          <p className="text-sm font-medium text-default-600">
            by{" "}
            {novel.authors
              .map((author) => "name" in author && author.name)
              .join(", ")}
          </p>
          <p className="text-sm font-medium text-default-600">
            Rating: {novel.rating}
          </p>
          <p className="text-sm font-medium text-default-600">
            Release Date: {new Date(novel.releaseDate).toLocaleDateString()}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NovelCard;
