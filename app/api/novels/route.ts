// app\api\novels\route.ts
import { NextRequest, NextResponse } from "next/server";
import { validationResult } from "express-validator";
import { Novel, INovel } from "@/models/novel";
import { Author, IAuthor } from "@/models/author";
import { Publisher, IPublisher } from "@/models/publisher";
import { Genre, IGenre } from "@/models/genre";
import { connectToDatabase } from "@/lib/db";
import { rateLimiter } from "@/lib/rateLimiter";
import { authMiddleware } from "@/lib/AuthMiddleware";
import { handleErrorResponse } from "@/lib/errorHandler"; // Import the error handler

export const dynamic = "force-dynamic";

const createNovelLimiter = rateLimiter(15 * 60 * 1000, 10);
const updateDeleteNovelLimiter = rateLimiter(15 * 60 * 1000, 5);

async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const authResponse = await authMiddleware(req);
    if (authResponse.status !== 200) {
      return authResponse;
    }

    const allowed = await createNovelLimiter(req);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      return NextResponse.json({ errors: errors.array() }, { status: 400 });
    }

    const {
      title,
      description,
      releaseDate,
      coverImage,
      rating,
      status,
      authors,
      publisher,
      genres,
    } = await req.json();

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

    let publisherDocument = await Publisher.findOne({ name: publisher });
    if (!publisherDocument) {
      publisherDocument = new Publisher({ name: publisher });
      await publisherDocument.save();
    }
    const publisherId = publisherDocument._id;

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
    return NextResponse.json({ id: novel._id }, { status: 201 }); // Explicitly return the novel ID
  } catch (error) {
    return handleErrorResponse(error); // Use the error handler
  }
}

async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const novels = await Novel.find()
      .populate("authors", "name bio")
      .populate("publisher", "name location")
      .populate("genres", "name");

    return NextResponse.json(novels);
  } catch (error) {
    return handleErrorResponse(error); // Use the error handler
  }
}

async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();

    const authResponse = await authMiddleware(req);
    if (authResponse.status !== 200) {
      return authResponse;
    }

    const allowed = await updateDeleteNovelLimiter(req);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      return NextResponse.json({ errors: errors.array() }, { status: 400 });
    }

    const {
      title,
      description,
      releaseDate,
      coverImage,
      rating,
      status,
      authors,
      publisher,
      genres,
    } = await req.json();
    const id = req.nextUrl.searchParams.get("id");

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

    let publisherDocument = await Publisher.findOne({ name: publisher });
    if (!publisherDocument) {
      publisherDocument = new Publisher({ name: publisher });
      await publisherDocument.save();
    }
    const publisherId = publisherDocument._id;

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

    const novel = await Novel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        releaseDate: new Date(releaseDate),
        coverImage,
        rating,
        status,
        authors: authorIds,
        publisher: publisherId,
        genres: genreIds,
      },
      { new: true }
    );

    if (!novel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }

    return NextResponse.json(novel);
  } catch (error) {
    return handleErrorResponse(error); // Use the error handler
  }
}

async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();

    const authResponse = await authMiddleware(req);
    if (authResponse.status !== 200) {
      return authResponse;
    }

    const allowed = await updateDeleteNovelLimiter(req);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const id = req.nextUrl.searchParams.get("id");
    const novel = await Novel.findByIdAndDelete(id);
    if (!novel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleErrorResponse(error); // Use the error handler
  }
}

export { POST, GET, PUT, DELETE };
