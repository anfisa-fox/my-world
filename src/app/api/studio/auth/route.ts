import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const studioSecret = request.headers.get("x-studio-secret");

  if (!process.env.STUDIO_SECRET) {
    return NextResponse.json(
      {
        success: false,
        error: "Studio secret is not configured.",
      },
      { status: 500 }
    );
  }

  if (studioSecret !== process.env.STUDIO_SECRET) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid Studio secret.",
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}