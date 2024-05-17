// api/publishers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { validationResult } from 'express-validator';
import { Publisher, IPublisher } from '@/models/publisher';
import { connectToDatabase } from '@/lib/db';
import { rateLimiter } from '@/lib/rateLimiter';

// Rate limiting configuration for creating a publisher
const createPublisherLimiter = rateLimiter(15 * 60 * 1000, 10); // 15 minutes, 10 requests per windowMs

// Rate limiting configuration for updating or deleting a publisher
const updateDeletePublisherLimiter = rateLimiter(15 * 60 * 1000, 5); // 15 minutes, 5 requests per windowMs

async function POST(req: NextRequest) {
  await connectToDatabase();

  const allowed = await createPublisherLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return NextResponse.json({ errors: errors.array() }, { status: 400 });
  }

  try {
    const { name, location, yearFounded } = await req.json();

    const publisher: IPublisher = new Publisher({
      name,
      location,
      yearFounded,
    });

    await publisher.save();
    return NextResponse.json(publisher, { status: 201 });
  } catch (error) {
    console.error('Failed to create publisher:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    const id = req.nextUrl.searchParams.get('id');
    if (id) {
      const publisher = await Publisher.findById(id).select('name');
      if (!publisher) {
        return NextResponse.json({ error: 'Publisher not found' }, { status: 404 });
      }
      return NextResponse.json(publisher);
    } else {
      const publishers = await Publisher.find().select('name');
      return NextResponse.json(publishers);
    }
  } catch (error) {
    console.error('Failed to retrieve publishers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function PUT(req: NextRequest) {
  await connectToDatabase();

  const allowed = await updateDeletePublisherLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return NextResponse.json({ errors: errors.array() }, { status: 400 });
  }

  try {
    const { name, location, yearFounded } = await req.json();

    const publisher = await Publisher.findByIdAndUpdate(
      req.nextUrl.searchParams.get('id'),
      {
        name,
        location,
        yearFounded,
      },
      { new: true }
    );

    if (!publisher) {
      return NextResponse.json({ error: 'Publisher not found' }, { status: 404 });
    }

    return NextResponse.json(publisher);
  } catch (error) {
    console.error('Failed to update publisher:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function DELETE(req: NextRequest) {
  await connectToDatabase();

  const allowed = await updateDeletePublisherLimiter(req);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const publisher = await Publisher.findByIdAndDelete(req.nextUrl.searchParams.get('id'));
    if (!publisher) {
      return NextResponse.json({ error: 'Publisher not found' }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete publisher:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export { POST, GET, PUT, DELETE };