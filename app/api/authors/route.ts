import { NextRequest, NextResponse } from 'next/server';
import { validationResult } from 'express-validator';
import { Author, IAuthor } from '@/models/author';
import { connectToDatabase } from '@/lib/db';
import { rateLimiter } from '@/lib/rateLimiter';

export const dynamic = 'force-dynamic';

// Rate limiting configuration for creating an author
const createAuthorLimiter = rateLimiter(15 * 60 * 1000, 10); // 15 minutes, 10 requests per windowMs

// Rate limiting configuration for updating or deleting an author
const updateDeleteAuthorLimiter = rateLimiter(15 * 60 * 1000, 5); // 15 minutes, 5 requests per windowMs

async function POST(req: NextRequest) {
  await connectToDatabase();

  const allowed = await createAuthorLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return NextResponse.json({ errors: errors.array() }, { status: 400 });
  }

  try {
    const { name, bio, website } = await req.json();

    const author: IAuthor = new Author({
      name,
      bio,
      website,
    });

    await author.save();
    return NextResponse.json(author, { status: 201 });
  } catch (error) {
    console.error('Failed to create author:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    const id = req.nextUrl.searchParams.get('id');
    if (id) {
      const author = await Author.findById(id).select('name');
      if (!author) {
        return NextResponse.json({ error: 'Author not found' }, { status: 404 });
      }
      return NextResponse.json(author);
    } else {
      const authors = await Author.find().select('name');
      return NextResponse.json(authors);
    }
  } catch (error) {
    console.error('Failed to retrieve authors:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function PUT(req: NextRequest) {
  await connectToDatabase();

  const allowed = await updateDeleteAuthorLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return NextResponse.json({ errors: errors.array() }, { status: 400 });
  }

  try {
    const { name, bio, website } = await req.json();

    const author = await Author.findByIdAndUpdate(
      req.nextUrl.searchParams.get('id'),
      {
        name,
        bio,
        website,
      },
      { new: true }
    );

    if (!author) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    return NextResponse.json(author);
  } catch (error) {
    console.error('Failed to update author:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function DELETE(req: NextRequest) {
  await connectToDatabase();

  const allowed = await updateDeleteAuthorLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const author = await Author.findByIdAndDelete(req.nextUrl.searchParams.get('id'));
    if (!author) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete author:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export { POST, GET, PUT, DELETE };
