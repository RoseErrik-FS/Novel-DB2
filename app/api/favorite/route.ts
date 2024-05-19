// app\api\favorite\route.ts
import { NextRequest, NextResponse } from "next/server";
import { validationResult } from "express-validator";
import { Favorite, IFavorite } from "@/models/favorite";
import { connectToDatabase } from "@/lib/db";
import { rateLimiter } from "@/lib/rateLimiter";
import { authMiddleware } from "@/lib/AuthMiddleware";

export const dynamic = "force-dynamic";

// Rate limiting configuration for creating a favorite
const createFavoriteLimiter = rateLimiter(15 * 60 * 1000, 10); // 15 minutes, 10 requests per windowMs

// Rate limiting configuration for deleting a favorite
const deleteFavoriteLimiter = rateLimiter(15 * 60 * 1000, 5); // 15 minutes, 5 requests per windowMs

async function POST(req: NextRequest) {
  await connectToDatabase();

  const authResponse = await authMiddleware(req);
  if (authResponse.status !== 200) {
    return authResponse;
  }

  const allowed = await createFavoriteLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return NextResponse.json({ errors: errors.array() }, { status: 400 });
  }

  try {
    const { user, novel } = await req.json();

    const favorite: IFavorite = new Favorite({
      user,
      novel,
    });

    await favorite.save();
    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error("Failed to create favorite:", error);
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
      const favorite = await Favorite.findById(
        req.nextUrl.searchParams.get("id")
      )
        .populate("user")
        .populate("novel");
      if (!favorite) {
        return NextResponse.json(
          { error: "Favorite not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(favorite);
    } else {
      const favorites = await Favorite.find()
        .populate("user")
        .populate("novel");
      return NextResponse.json(favorites);
    }
  } catch (error) {
    console.error("Failed to retrieve favorites:", error);
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

  const allowed = await deleteFavoriteLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const deletedFavorite = await Favorite.findByIdAndDelete(
      req.nextUrl.searchParams.get("id")
    );
    if (!deletedFavorite) {
      return NextResponse.json(
        { error: "Favorite not found" },
        { status: 404 }
      );
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete favorite:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export { POST, GET, DELETE };
