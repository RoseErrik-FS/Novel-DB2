// app/api/novels/count/route.ts

import { connectToDatabase } from '@/lib/db';
import { Novel } from '@/models/novel';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const totalNovels = await fetchTotalNovelsCount();

    return new Response(JSON.stringify({ count: totalNovels }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching total novels count:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

async function fetchTotalNovelsCount(): Promise<number> {
  return Novel.countDocuments();
}