// app\api\character\route.ts
import { NextRequest, NextResponse } from "next/server";
import { validationResult } from "express-validator";
import { Character, ICharacter } from "@/models/character";
import { connectToDatabase } from "@/lib/db";
import { rateLimiter } from "@/lib/rateLimiter";
import { authMiddleware } from "@/lib/AuthMiddleware";
import { handleErrorResponse } from "@/lib/errorHandler"; // Import the error handler

export const dynamic = "force-dynamic";

// Rate limiting configuration for creating a character
const createCharacterLimiter = rateLimiter(15 * 60 * 1000, 10); // 15 minutes, 10 requests per windowMs

// Rate limiting configuration for updating or deleting a character
const updateDeleteCharacterLimiter = rateLimiter(15 * 60 * 1000, 5); // 15 minutes, 5 requests per windowMs

async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const authResponse = await authMiddleware(req);
    if (authResponse.status !== 200) {
      return authResponse;
    }

    const allowed = await createCharacterLimiter(req);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      return NextResponse.json({ errors: errors.array() }, { status: 400 });
    }

    const { name, description, novel } = await req.json();

    const character: ICharacter = new Character({
      name,
      description,
      novel,
    });

    await character.save();
    return NextResponse.json(character, { status: 201 });
  } catch (error) {
    return handleErrorResponse(error); // Use the error handler
  }
}

async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    if (req.nextUrl.searchParams.get("id")) {
      const character = await Character.findById(
        req.nextUrl.searchParams.get("id")
      ).populate("novel");
      if (!character) {
        return NextResponse.json(
          { error: "Character not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(character);
    } else {
      const characters = await Character.find().populate("novel");
      return NextResponse.json(characters);
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

    const allowed = await updateDeleteCharacterLimiter(req);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      return NextResponse.json({ errors: errors.array() }, { status: 400 });
    }

    const { name, description, novel } = await req.json();

    const characterData: Partial<ICharacter> = {
      name,
      description,
      novel,
    };

    const updatedCharacter = await Character.findByIdAndUpdate(
      req.nextUrl.searchParams.get("id"),
      characterData,
      { new: true }
    ).populate("novel");

    if (!updatedCharacter) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCharacter);
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

    const allowed = await updateDeleteCharacterLimiter(req);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const deletedCharacter = await Character.findByIdAndDelete(
      req.nextUrl.searchParams.get("id")
    );
    if (!deletedCharacter) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleErrorResponse(error); // Use the error handler
  }
}

export { POST, GET, PUT, DELETE };
