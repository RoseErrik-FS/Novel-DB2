// app\api\publishers\route.ts
import { NextRequest, NextResponse } from "next/server";
import { validationResult } from "express-validator";
import { Publisher, IPublisher } from "@/models/publisher";
import { connectToDatabase } from "@/lib/db";
import { rateLimiter } from "@/lib/rateLimiter";
import { authMiddleware } from "@/lib/AuthMiddleware";
import { handleErrorResponse } from "@/lib/errorHandler"; // Import the error handler

export const dynamic = "force-dynamic";

// Rate limiting configuration for creating a publisher
const createPublisherLimiter = rateLimiter(15 * 60 * 1000, 10); // 15 minutes, 10 requests per windowMs

// Rate limiting configuration for updating or deleting a publisher
const updateDeletePublisherLimiter = rateLimiter(15 * 60 * 1000, 5); // 15 minutes, 5 requests per windowMs

async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const authResponse = await authMiddleware(req);
    if (authResponse.status !== 200) {
      return authResponse;
    }

    const allowed = await createPublisherLimiter(req);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      return NextResponse.json({ errors: errors.array() }, { status: 400 });
    }

    const { name, location, yearFounded } = await req.json();

    const publisher: IPublisher = new Publisher({
      name,
      location,
      yearFounded,
    });

    await publisher.save();
    return NextResponse.json(publisher, { status: 201 });
  } catch (error) {
    return handleErrorResponse(error); // Use the error handler
  }
}

async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const id = req.nextUrl.searchParams.get("id");
    if (id) {
      const publisher = await Publisher.findById(id).select("name");
      if (!publisher) {
        return NextResponse.json(
          { error: "Publisher not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(publisher);
    } else {
      const publishers = await Publisher.find().select("name");
      return NextResponse.json(publishers);
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

    const allowed = await updateDeletePublisherLimiter(req);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      return NextResponse.json({ errors: errors.array() }, { status: 400 });
    }

    const { name, location, yearFounded } = await req.json();

    const publisher = await Publisher.findByIdAndUpdate(
      req.nextUrl.searchParams.get("id"),
      {
        name,
        location,
        yearFounded,
      },
      { new: true }
    );

    if (!publisher) {
      return NextResponse.json(
        { error: "Publisher not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(publisher);
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

    const allowed = await updateDeletePublisherLimiter(req);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const publisher = await Publisher.findByIdAndDelete(
      req.nextUrl.searchParams.get("id")
    );
    if (!publisher) {
      return NextResponse.json(
        { error: "Publisher not found" },
        { status: 404 }
      );
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleErrorResponse(error); // Use the error handler
  }
}

export { POST, GET, PUT, DELETE };
