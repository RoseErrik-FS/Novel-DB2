// app\api\novels\count\route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Novel } from "@/models/novel";
import { handleErrorResponse } from "@/lib/errorHandler";

export const dynamic = "force-dynamic";

async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const totalNovels = await Novel.countDocuments();

    return NextResponse.json({ count: totalNovels }, { status: 200 });
  } catch (error) {
    return handleErrorResponse(error);
  }
}

export { GET };
