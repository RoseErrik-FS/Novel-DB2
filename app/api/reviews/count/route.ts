// app/api/reviews/count/route.ts

import { connectToDatabase } from '@/lib/db';
import { Review } from '@/models/review';

async function GET(request: Request) {
  try {
    await connectToDatabase();
    const totalReviews = await fetchTotalReviewsCount();

    return new Response(JSON.stringify({ count: totalReviews }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching total reviews count:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

async function fetchTotalReviewsCount(): Promise<number> {
  return Review.countDocuments();
}

export { GET };