'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NovelDetails from '@/components/novels/NovelDetails';
import AddNovelForm from '@/components/novels/AddNovelForm';
import { fetchNovelById } from '@/lib/FetchNovels';
import { INovel } from '@/models/novel';
import { Spinner } from '@nextui-org/react';

interface NovelClientProps {
  novelId: string;
}

const NovelClient: React.FC<NovelClientProps> = ({ novelId }) => {
  const [novel, setNovel] = useState<INovel | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchNovel = async () => {
      if (novelId === 'new') {
        setLoading(false);
        return;
      }

      try {
        const fetchedNovel = await fetchNovelById('/api/novels', novelId);
        if (!fetchedNovel) {
          router.push('/404');
        } else {
          setNovel(fetchedNovel);
        }
      } catch (error) {
        console.error('Error fetching novel:', error);
        router.push('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchNovel();
  }, [novelId, router]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }

  if (novelId === 'new') {
    return <AddNovelForm />;
  }

  return novel ? <NovelDetails novel={novel} /> : null;
};

export default NovelClient;
