// app/api/sitemap/route.ts
import { generateSitemaps } from "@/app/Sitemap/sitemap";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sitemaps = await generateSitemaps();

  return NextResponse.json(sitemaps, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
