'use client';

import React from 'react';
import { INovel } from '@/models/novel';
import { Card, Image, Divider, CardBody, CardHeader, Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { IGenre } from '@/models/genre';
import { useSession } from 'next-auth/react';

interface NovelDetailsProps {
  novel: INovel | null;
}

const NovelDetails: React.FC<NovelDetailsProps> = ({ novel }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (!novel) {
    return <div>Novel not found.</div>;
  }

  const handleEditClick = () => {
    router.push(`/novels/${novel._id}/edit`);
  };

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">{novel.title}</h2>
          {status === 'authenticated' && (
            <Button onClick={handleEditClick} className="ml-auto">
              Edit Novel
            </Button>
          )}
        </CardHeader>
        <Divider className="my-4" />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Image
                src={novel.coverImage ?? '/test.png'}
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
              {novel.publisher && 'name' in novel.publisher && (
                <p className="text-sm text-gray-500">
                  Publisher: {novel.publisher.name}
                </p>
              )}
              <p className="text-sm text-gray-500">
                Genres:{' '}
                {novel.genres
                  .filter((genre): genre is IGenre => 'name' in genre)
                  .map((genre) => genre.name)
                  .join(', ')}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default NovelDetails;
