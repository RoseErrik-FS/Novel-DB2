import { NextRequest, NextResponse } from 'next/server';
import { Novel } from '@/models/novel';
import { connectToDatabase } from '@/lib/db';
import { rateLimiter } from '@/lib/rateLimiter';

// Rate limiting configuration for searching novels
const searchNovelLimiter = rateLimiter(15 * 60 * 1000, 10); // 15 minutes, 10 requests per windowMs

async function getHandler(req: NextRequest) {
  await connectToDatabase();

  const allowed = await searchNovelLimiter(req);

  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const query = req.nextUrl.searchParams.get('q');

    const novels = await Novel.aggregate([
      {
        $lookup: {
          from: 'authors',
          localField: 'authors',
          foreignField: '_id',
          as: 'authors',
        },
      },
      {
        $lookup: {
          from: 'publishers',
          localField: 'publisher',
          foreignField: '_id',
          as: 'publisher',
        },
      },
      {
        $lookup: {
          from: 'genres',
          localField: 'genres',
          foreignField: '_id',
          as: 'genres',
        },
      },
      {
        $match: {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { 'authors.name': { $regex: query, $options: 'i' } },
            { 'genres.name': { $regex: query, $options: 'i' } },
          ],
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          releaseDate: 1,
          coverImage: 1,
          rating: 1,
          status: 1,
          authors: {
            _id: 1,
            name: 1,
            bio: 1,
          },
          publisher: {
            _id: 1,
            name: 1,
            location: 1,
          },
          genres: {
            _id: 1,
            name: 1,
          },
        },
      },
    ]);

    return NextResponse.json(novels);
  } catch (error) {
    console.error('Failed to search novels:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export { getHandler as GET };