// app/api/novels/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { validationResult } from 'express-validator';
import { Novel, INovel } from '@/models/novel';
import { Author, IAuthor } from '@/models/author';
import { Publisher, IPublisher } from '@/models/publisher';
import { Genre, IGenre } from '@/models/genre';
import { connectToDatabase } from '@/lib/db';
import { rateLimiter } from '@/lib/rateLimiter';

// Rate limiting configuration for creating a novel
const createNovelLimiter = rateLimiter(15 * 60 * 1000, 10); // 15 minutes, 10 requests per windowMs

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();

  try {
    const { id } = params;
    if (id === "new") {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const novel = await Novel.findById(id)
      .populate('authors', 'name bio')
      .populate('publisher', 'name location')
      .populate('genres', 'name');

    if (!novel) {
      return NextResponse.json({ error: 'Novel not found' }, { status: 404 });
    }

    return NextResponse.json(novel);
  } catch (error) {
    console.error('Failed to retrieve novel:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


export async function postHandler(req: NextRequest) {
  await connectToDatabase();

  const allowed = await createNovelLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return NextResponse.json({ errors: errors.array() }, { status: 400 });
  }

  try {
    const { title, description, releaseDate, coverImage, rating, status, authors, publisher, genres } = await req.json();

    // Ensure authors, publisher, and genres exist
    const authorDocuments = await Author.find({ _id: { $in: authors } });
    if (authorDocuments.length !== authors.length) {
      return NextResponse.json({ error: 'One or more authors not found' }, { status: 404 });
    }

    const publisherDocument = await Publisher.findById(publisher);
    if (!publisherDocument) {
      return NextResponse.json({ error: 'Publisher not found' }, { status: 404 });
    }

    const genreDocuments = await Genre.find({ _id: { $in: genres } });
    if (genreDocuments.length !== genres.length) {
      return NextResponse.json({ error: 'One or more genres not found' }, { status: 404 });
    }

    const novel: INovel = new Novel({
      title,
      description,
      releaseDate: new Date(releaseDate),
      coverImage,
      rating,
      status,
      authors,
      publisher,
      genres,
    });

    await novel.save();
    return NextResponse.json(novel, { status: 201 });
  } catch (error) {
    console.error('Failed to create novel:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
