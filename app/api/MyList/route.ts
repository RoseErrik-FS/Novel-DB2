// app/api/MyList/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from "next-auth/react";
import { MyList, IMyList } from "@/models/myList";
import { Novel, INovel } from "@/models/novel";
import { connectToDatabase } from "@/lib/db";

async function GET(req: NextRequest) {
  await connectToDatabase();

  const headers = Object.fromEntries(req.headers.entries());
  const mockReq = {
    headers,
  };
  const session = await getSession({ req: mockReq });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const myLists = await MyList.find({ userId: session.user?.email }).populate("novelId");
    return NextResponse.json(myLists);
  } catch (error) {
    console.error('Failed to retrieve user lists:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function POST(req: NextRequest) {
  await connectToDatabase();

  const headers = Object.fromEntries(req.headers.entries());
  const mockReq = {
    headers,
  };
  const session = await getSession({ req: mockReq });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { novelId } = await req.json();

    const myList: IMyList = new MyList({
      userId: session.user?.email,
      novelId,
    });

    await myList.save();
    return NextResponse.json(myList, { status: 201 });
  } catch (error) {
    console.error('Failed to create user list:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function PUT(req: NextRequest) {
  await connectToDatabase();

  const headers = Object.fromEntries(req.headers.entries());
  const mockReq = {
    headers,
  };
  const session = await getSession({ req: mockReq });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { novelId } = await req.json();
    const id = req.nextUrl.searchParams.get('id');

    const myList = await MyList.findOneAndUpdate(
      { _id: id, userId: session.user?.email },
      { novelId },
      { new: true }
    );

    if (!myList) {
      return NextResponse.json({ error: 'User list not found' }, { status: 404 });
    }

    return NextResponse.json(myList);
  } catch (error) {
    console.error('Failed to update user list:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function DELETE(req: NextRequest) {
  await connectToDatabase();

  const headers = Object.fromEntries(req.headers.entries());
  const mockReq = {
    headers,
  };
  const session = await getSession({ req: mockReq });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = req.nextUrl.searchParams.get('id');
    const myList = await MyList.findOneAndDelete({ _id: id, userId: session.user?.email });
    if (!myList) {
      return NextResponse.json({ error: 'User list not found' }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete user list:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export { POST, GET, PUT, DELETE };