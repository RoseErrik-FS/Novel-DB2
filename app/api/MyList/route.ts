// app/api/MyList/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "next-auth/react";
import { MyList, IMyList } from "@/models/myList";
import { connectToDatabase } from "@/lib/db";
import { authMiddleware } from "@/lib/AuthMiddleware";
import { handleErrorResponse } from "@/lib/errorHandler"; // Import the error handler

export const dynamic = "force-dynamic";

async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const headers = Object.fromEntries(req.headers.entries());
    const mockReq = { headers };
    const session = await getSession({ req: mockReq });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const myLists = await MyList.find({ userId: session.user?.email }).populate(
      "novelId"
    );
    return NextResponse.json(myLists);
  } catch (error) {
    return handleErrorResponse(error); // Use the error handler
  }
}

async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const authResponse = await authMiddleware(req);
    if (authResponse.status !== 200) {
      return authResponse;
    }

    const headers = Object.fromEntries(req.headers.entries());
    const mockReq = { headers };
    const session = await getSession({ req: mockReq });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { novelId, collectionName } = await req.json();

    const myList: IMyList = new MyList({
      userId: session.user?.email,
      novelId,
      collectionName,
    });

    await myList.save();
    return NextResponse.json(myList, { status: 201 });
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

    const headers = Object.fromEntries(req.headers.entries());
    const mockReq = { headers };
    const session = await getSession({ req: mockReq });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { novelId } = await req.json();
    const id = req.nextUrl.searchParams.get("id");

    const myList = await MyList.findOneAndUpdate(
      { _id: id, userId: session.user?.email },
      { novelId },
      { new: true }
    );

    if (!myList) {
      return NextResponse.json(
        { error: "User list not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(myList);
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

    const headers = Object.fromEntries(req.headers.entries());
    const mockReq = { headers };
    const session = await getSession({ req: mockReq });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { novelId } = await req.json();
    const myList = await MyList.findOneAndDelete({
      novelId,
      userId: session.user?.email,
    });

    if (!myList) {
      return NextResponse.json(
        { error: "User list not found" },
        { status: 404 }
      );
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleErrorResponse(error); // Use the error handler
  }
}

export { POST, GET, PUT, DELETE };
