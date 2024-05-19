// app\api\reviews\route.ts
import { NextRequest, NextResponse } from "next/server";
import { validationResult } from "express-validator";
import { Review, IReview } from "@/models/review";
import { Novel, INovel } from "@/models/novel";
import { User, IUser } from "@/models/user";
import { connectToDatabase } from "@/lib/db";
import { rateLimiter } from "@/lib/rateLimiter";
import { authMiddleware } from "@/lib/AuthMiddleware";

export const dynamic = "force-dynamic";

// Rate limiting configuration for creating a review
const createReviewLimiter = rateLimiter(15 * 60 * 1000, 5); // 15 minutes, 5 requests per windowMs

// Rate limiting configuration for updating or deleting a review
const updateDeleteReviewLimiter = rateLimiter(15 * 60 * 1000, 3); // 15 minutes, 3 requests per windowMs

async function POST(req: NextRequest) {
  await connectToDatabase();

  const authResponse = await authMiddleware(req);
  if (authResponse.status !== 200) {
    return authResponse;
  }

  const allowed = await createReviewLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return NextResponse.json({ errors: errors.array() }, { status: 400 });
  }

  try {
    const { rating, comment, novelId, userId } = await req.json();

    const novel: INovel | null = await Novel.findById(novelId);
    if (!novel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }

    const user: IUser | null = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const review: IReview = new Review({
      rating,
      comment,
      novel: novel._id,
      user: user._id,
    });

    await review.save();
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    if (req.nextUrl.searchParams.get("id")) {
      const review: IReview | null = await Review.findById(
        req.nextUrl.searchParams.get("id")
      )
        .populate<{ novel: INovel }>("novel")
        .populate<{ user: IUser }>("user");
      if (!review) {
        return NextResponse.json(
          { error: "Review not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(review);
    } else {
      const reviews = await Review.find()
        .populate<{ novel: INovel }>("novel")
        .populate<{ user: IUser }>("user");
      return NextResponse.json(reviews as IReview[]);
    }
  } catch (error) {
    console.error("Failed to retrieve reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function PUT(req: NextRequest) {
  await connectToDatabase();

  const authResponse = await authMiddleware(req);
  if (authResponse.status !== 200) {
    return authResponse;
  }

  const allowed = await updateDeleteReviewLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return NextResponse.json({ errors: errors.array() }, { status: 400 });
  }

  try {
    const { rating, comment } = await req.json();

    const review: IReview | null = await Review.findByIdAndUpdate(
      req.nextUrl.searchParams.get("id"),
      {
        rating,
        comment,
      },
      { new: true }
    );

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("Failed to update review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function DELETE(req: NextRequest) {
  await connectToDatabase();

  const authResponse = await authMiddleware(req);
  if (authResponse.status !== 200) {
    return authResponse;
  }

  const allowed = await updateDeleteReviewLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const review: IReview | null = await Review.findByIdAndDelete(
      req.nextUrl.searchParams.get("id")
    );
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export { POST, GET, PUT, DELETE };
