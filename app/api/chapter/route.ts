// app\api\chapter\route.ts
import { NextRequest, NextResponse } from "next/server";
import { validationResult } from "express-validator";
import { Chapter, IChapter } from "@/models/chapter";
import { connectToDatabase } from "@/lib/db";
import { rateLimiter } from "@/lib/rateLimiter";
import { authMiddleware } from "@/lib/AuthMiddleware";
import { handleErrorResponse } from "@/lib/errorHandler"; // Import the error handler

export const dynamic = "force-dynamic";

// Rate limiting configuration for creating a chapter
const createChapterLimiter = rateLimiter(15 * 60 * 1000, 10); // 15 minutes, 10 requests per windowMs

// Rate limiting configuration for updating or deleting a chapter
const updateDeleteChapterLimiter = rateLimiter(15 * 60 * 1000, 5); // 15 minutes, 5 requests per windowMs

async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const authResponse = await authMiddleware(req);
    if (authResponse.status !== 200) {
      return authResponse;
    }

    const allowed = await createChapterLimiter(req);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      return NextResponse.json({ errors: errors.array() }, { status: 400 });
    }

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
    return handleErrorResponse(error); // Use the error handler
  }
}

async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    if (req.nextUrl.searchParams.get("id")) {
      const chapter = await Chapter.findById(
        req.nextUrl.searchParams.get("id")
      ).populate("volume");
      if (!chapter) {
        return NextResponse.json(
          { error: "Chapter not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(chapter);
    } else {
      const chapters = await Chapter.find().populate("volume");
      return NextResponse.json(chapters);
    }
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

    const allowed = await updateDeleteChapterLimiter(req);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      return NextResponse.json({ errors: errors.array() }, { status: 400 });
    }

    const { title, number, releaseDate, volume } = await req.json();

    const chapterData: Partial<IChapter> = {
      title,
      number,
      releaseDate,
      volume,
    };

    const updatedChapter = await Chapter.findByIdAndUpdate(
      req.nextUrl.searchParams.get("id"),
      chapterData,
      { new: true }
    ).populate("volume");

    if (!updatedChapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    return NextResponse.json(updatedChapter);
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

    const allowed = await updateDeleteChapterLimiter(req);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const deletedChapter = await Chapter.findByIdAndDelete(
      req.nextUrl.searchParams.get("id")
    );
    if (!deletedChapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleErrorResponse(error); // Use the error handler
  }
}

export { POST, GET, PUT, DELETE };
