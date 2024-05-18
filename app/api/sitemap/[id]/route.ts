// app/api/[id]/route.ts
import sitemap from "@/app/Sitemap/sitemap";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const sitemapData = await sitemap({ params: { id } });

  return NextResponse.json(sitemapData, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
