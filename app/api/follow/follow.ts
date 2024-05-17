// api/follows/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { validationResult } from 'express-validator';
import { Follow, IFollow } from '@/models/follow';
import { connectToDatabase } from '@/lib/db';
import { rateLimiter } from '@/lib/rateLimiter';

// Rate limiting configuration for creating a follow
const createFollowLimiter = rateLimiter(15 * 60 * 1000, 10); // 15 minutes, 10 requests per windowMs

// Rate limiting configuration for deleting a follow
const deleteFollowLimiter = rateLimiter(15 * 60 * 1000, 5); // 15 minutes, 5 requests per windowMs

async function postHandler(req: NextRequest) {
  await connectToDatabase();

  const allowed = await createFollowLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return NextResponse.json({ errors: errors.array() }, { status: 400 });
  }

  try {
    const { user, followedAuthor, followedNovel } = await req.json();

    const follow: IFollow = new Follow({
      user,
      followedAuthor,
      followedNovel,
    });

    await follow.save();
    return NextResponse.json(follow, { status: 201 });
  } catch (error) {
    console.error('Failed to create follow:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getHandler(req: NextRequest) {
  await connectToDatabase();

  try {
    if (req.nextUrl.searchParams.get('id')) {
      const follow = await Follow.findById(req.nextUrl.searchParams.get('id'))
        .populate('user')
        .populate('followedAuthor')
        .populate('followedNovel');
      if (!follow) {
        return NextResponse.json({ error: 'Follow not found' }, { status: 404 });
      }
      return NextResponse.json(follow);
    } else {
      const follows = await Follow.find()
        .populate('user')
        .populate('followedAuthor')
        .populate('followedNovel');
      return NextResponse.json(follows);
    }
  } catch (error) {
    console.error('Failed to retrieve follows:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function deleteHandler(req: NextRequest) {
  await connectToDatabase();

  const allowed = await deleteFollowLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const deletedFollow = await Follow.findByIdAndDelete(req.nextUrl.searchParams.get('id'));
    if (!deletedFollow) {
      return NextResponse.json({ error: 'Follow not found' }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete follow:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export { postHandler as POST, getHandler as GET, deleteHandler as DELETE };