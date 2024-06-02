// app\api\reviews\count\route.ts
import { connectToDatabase } from "@/lib/db";
import { Review } from "@/models/review";
import { handleErrorResponse } from "@/lib/errorHandler"; // Import the error handler

export const dynamic = "force-dynamic";

async function GET(request: Request) {
  try {
    await connectToDatabase();
    const totalReviews = await fetchTotalReviewsCount();

    return new Response(JSON.stringify({ count: totalReviews }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return handleErrorResponse(error); // Use the error handler
  }
}

async function fetchTotalReviewsCount(): Promise<number> {
  return Review.countDocuments();
}

export { GET };
