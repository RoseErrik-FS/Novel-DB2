// api/characters/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { validationResult } from 'express-validator';
import { Character, ICharacter } from '@/models/character';
import { connectToDatabase } from '@/lib/db';
import { rateLimiter } from '@/lib/rateLimiter';

// Rate limiting configuration for creating a character
const createCharacterLimiter = rateLimiter(15 * 60 * 1000, 10); // 15 minutes, 10 requests per windowMs

// Rate limiting configuration for updating or deleting a character
const updateDeleteCharacterLimiter = rateLimiter(15 * 60 * 1000, 5); // 15 minutes, 5 requests per windowMs

async function postHandler(req: NextRequest) {
  await connectToDatabase();

  const allowed = await createCharacterLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return NextResponse.json({ errors: errors.array() }, { status: 400 });
  }

  try {
    const { name, description, novel } = await req.json();

    const character: ICharacter = new Character({
      name,
      description,
      novel,
    });

    await character.save();
    return NextResponse.json(character, { status: 201 });
  } catch (error) {
    console.error('Failed to create character:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getHandler(req: NextRequest) {
  await connectToDatabase();

  try {
    if (req.nextUrl.searchParams.get('id')) {
      const character = await Character.findById(req.nextUrl.searchParams.get('id')).populate('novel');
      if (!character) {
        return NextResponse.json({ error: 'Character not found' }, { status: 404 });
      }
      return NextResponse.json(character);
    } else {
      const characters = await Character.find().populate('novel');
      return NextResponse.json(characters);
    }
  } catch (error) {
    console.error('Failed to retrieve characters:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function putHandler(req: NextRequest) {
  await connectToDatabase();

  const allowed = await updateDeleteCharacterLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return NextResponse.json({ errors: errors.array() }, { status: 400 });
  }

  try {
    const { name, description, novel } = await req.json();

    const characterData: Partial<ICharacter> = {
      name,
      description,
      novel,
    };

    const updatedCharacter = await Character.findByIdAndUpdate(
      req.nextUrl.searchParams.get('id'),
      characterData,
      { new: true }
    ).populate('novel');

    if (!updatedCharacter) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    return NextResponse.json(updatedCharacter);
  } catch (error) {
    console.error('Failed to update character:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function deleteHandler(req: NextRequest) {
  await connectToDatabase();

  const allowed = await updateDeleteCharacterLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const deletedCharacter = await Character.findByIdAndDelete(req.nextUrl.searchParams.get('id'));
    if (!deletedCharacter) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete character:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export { postHandler as POST, getHandler as GET, putHandler as PUT, deleteHandler as DELETE };