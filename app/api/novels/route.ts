// api/novels/route.ts
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

// Rate limiting configuration for updating or deleting a novel
const updateDeleteNovelLimiter = rateLimiter(15 * 60 * 1000, 5); // 15 minutes, 5 requests per windowMs

async function POST(req: NextRequest) {
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

    // Ensure authors exist or create them
    const authorIds = await Promise.all(
      authors.map(async (authorName: string) => {
        let author = await Author.findOne({ name: authorName });
        if (!author) {
          author = new Author({ name: authorName });
          await author.save();
        }
        return author._id;
      })
    );

    // Ensure publisher exists or create it
    let publisherDocument = await Publisher.findOne({ name: publisher });
    if (!publisherDocument) {
      publisherDocument = new Publisher({ name: publisher });
      await publisherDocument.save();
    }
    const publisherId = publisherDocument._id;

    // Ensure genres exist or create them
    const genreIds = await Promise.all(
      genres.map(async (genreName: string) => {
        let genre = await Genre.findOne({ name: genreName });
        if (!genre) {
          genre = new Genre({ name: genreName });
          await genre.save();
        }
        return genre._id;
      })
    );

    const novel: INovel = new Novel({
      title,
      description,
      releaseDate: new Date(releaseDate),
      coverImage,
      rating,
      status,
      authors: authorIds,
      publisher: publisherId,
      genres: genreIds,
    });

    await novel.save();
    return NextResponse.json(novel, { status: 201 });
  } catch (error) {
    console.error('Failed to create novel:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function GET(_req: Request) {
  await connectToDatabase();
  

  try {
    const novels = await Novel.find()
      .populate('authors', 'name bio')
      .populate('publisher', 'name location')
      .populate('genres', 'name');

    return NextResponse.json(novels);
  } catch (error) {
    console.error('Failed to retrieve novels:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function PUT(req: NextRequest) {
  await connectToDatabase();


  const allowed = await updateDeleteNovelLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return NextResponse.json({ errors: errors.array() }, { status: 400 });
  }

  try {
    const { title, description, releaseDate, coverImage, rating, status, authors, publisher, genres } = await req.json();
    const id = req.nextUrl.searchParams.get('id');

    // Create authors, publisher, and genres using their respective models
    const authorDocuments = await Author.create(authors);
    const authorData: IAuthor[] = Array.isArray(authorDocuments)
      ? authorDocuments.map((doc) => doc.toObject())
      : [authorDocuments.toObject()];

    const publisherData: IPublisher = await Publisher.create(publisher);

    const genreDocuments = await Genre.create(genres);
    const genreData: IGenre[] = Array.isArray(genreDocuments)
      ? genreDocuments.map((doc) => doc.toObject())
      : [genreDocuments.toObject()];

    const novel = await Novel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        releaseDate: new Date(releaseDate),
        coverImage,
        rating,
        status,
        authors: authorData.map(author => author._id),
        publisher: publisherData._id,
        genres: genreData.map(genre => genre._id),
      },
      { new: true }
    );

    if (!novel) {
      return NextResponse.json({ error: 'Novel not found' }, { status: 404 });
    }

    return NextResponse.json(novel);
  } catch (error) {
    console.error('Failed to update novel:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function DELETE(req: NextRequest) {
  await connectToDatabase();

  const allowed = await updateDeleteNovelLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const id = req.nextUrl.searchParams.get('id');
    const novel = await Novel.findByIdAndDelete(id);
    if (!novel) {
      return NextResponse.json({ error: 'Novel not found' }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete novel:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export { POST, GET, PUT, DELETE };