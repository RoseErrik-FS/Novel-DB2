import { NextRequest, NextResponse } from 'next/server';
import { validationResult } from 'express-validator';
import { Chapter, IChapter } from '@/models/chapter';
import { connectToDatabase } from '@/lib/db';
import { rateLimiter } from '@/lib/rateLimiter';

// Rate limiting configuration for creating a chapter
const createChapterLimiter = rateLimiter(15 * 60 * 1000, 10); // 15 minutes, 10 requests per windowMs

// Rate limiting configuration for updating or deleting a chapter
const updateDeleteChapterLimiter = rateLimiter(15 * 60 * 1000, 5); // 15 minutes, 5 requests per windowMs

async function POST(req: NextRequest) {
  await connectToDatabase();

  const allowed = await createChapterLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return NextResponse.json({ errors: errors.array() }, { status: 400 });
  }

  try {
    const { title, number, releaseDate, volume } = await req.json();

    const chapter: IChapter = new Chapter({
      title,
      number,
      releaseDate,
      volume,
    });

    await chapter.save();
    return NextResponse.json(chapter, { status: 201 });
  } catch (error) {
    console.error('Failed to create chapter:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    if (req.nextUrl.searchParams.get('id')) {
      const chapter = await Chapter.findById(req.nextUrl.searchParams.get('id')).populate('volume');
      if (!chapter) {
        return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
      }
      return NextResponse.json(chapter);
    } else {
      const chapters = await Chapter.find().populate('volume');
      return NextResponse.json(chapters);
    }
  } catch (error) {
    console.error('Failed to retrieve chapters:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function PUT(req: NextRequest) {
  await connectToDatabase();

  const allowed = await updateDeleteChapterLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return NextResponse.json({ errors: errors.array() }, { status: 400 });
  }

  try {
    const { title, number, releaseDate, volume } = await req.json();

    const chapterData: Partial<IChapter> = {
      title,
      number,
      releaseDate,
      volume,
    };

    const updatedChapter = await Chapter.findByIdAndUpdate(
      req.nextUrl.searchParams.get('id'),
      chapterData,
      { new: true }
    ).populate('volume');

    if (!updatedChapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error('Failed to update chapter:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function DELETE(req: NextRequest) {
  await connectToDatabase();

  const allowed = await updateDeleteChapterLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const deletedChapter = await Chapter.findByIdAndDelete(req.nextUrl.searchParams.get('id'));
    if (!deletedChapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete chapter:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export { POST, GET, PUT, DELETE };
