// api/genres/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { validationResult } from 'express-validator';
import { Genre, IGenre } from '@/models/genre';
import { connectToDatabase } from '@/lib/db';
import { rateLimiter } from '@/lib/rateLimiter';

// Rate limiting configuration for creating a genre
const createGenreLimiter = rateLimiter(15 * 60 * 1000, 10); // 15 minutes, 10 requests per windowMs

// Rate limiting configuration for updating or deleting a genre
const updateDeleteGenreLimiter = rateLimiter(15 * 60 * 1000, 5); // 15 minutes, 5 requests per windowMs

async function POST(req: NextRequest) {
  await connectToDatabase();

  const allowed = await createGenreLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return NextResponse.json({ errors: errors.array() }, { status: 400 });
  }

  try {
    const { name } = await req.json();

    const genre: IGenre = new Genre({
      name,
    });

    await genre.save();
    return NextResponse.json(genre, { status: 201 });
  } catch (error) {
    console.error('Failed to create genre:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    const id = req.nextUrl.searchParams.get('id');
    if (id) {
      const genre = await Genre.findById(id).select('name');
      if (!genre) {
        return NextResponse.json({ error: 'Genre not found' }, { status: 404 });
      }
      return NextResponse.json(genre);
    } else {
      const genres = await Genre.find().select('name');
      return NextResponse.json(genres);
    }
  } catch (error) {
    console.error('Failed to retrieve genres:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function PUT(req: NextRequest) {
  await connectToDatabase();

  const allowed = await updateDeleteGenreLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return NextResponse.json({ errors: errors.array() }, { status: 400 });
  }

  try {
    const { name } = await req.json();

    const genre = await Genre.findByIdAndUpdate(
      req.nextUrl.searchParams.get('id'),
      {
        name,
      },
      { new: true }
    );

    if (!genre) {
      return NextResponse.json({ error: 'Genre not found' }, { status: 404 });
    }

    return NextResponse.json(genre);
  } catch (error) {
    console.error('Failed to update genre:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function DELETE(req: NextRequest) {
  await connectToDatabase();

  const allowed = await updateDeleteGenreLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const genre = await Genre.findByIdAndDelete(req.nextUrl.searchParams.get('id'));
    if (!genre) {
      return NextResponse.json({ error: 'Genre not found' }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete genre:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export { POST, GET, PUT, DELETE };