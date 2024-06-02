// lib/errorHandler.ts
import { NextResponse } from "next/server";

export function handleErrorResponse(error: any): NextResponse {
  console.error("Error occurred:", error);

  if (error.code === "ECONNREFUSED") {
    return NextResponse.json(
      { error: "Database connection refused" },
      { status: 503 }
    );
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
