import { NextResponse } from "next/server";

import { createPost } from "@/lib/github";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Title is required",
        },
        { status: 400 }
      );
    }

    const result = await createPost({
      title: body.title,
      content: body.content ?? "",
    });

    return NextResponse.json({
      success: true,
      slug: result.slug,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}