import { NextResponse } from "next/server";

import { deletePost } from "@/lib/github";
import { getPostBySlug } from "@/lib/posts";

function validateStudioSecret(request: Request) {
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

  return null;
}

export async function DELETE(request: Request) {
  try {
    const authError = validateStudioSecret(request);

    if (authError) {
      return authError;
    }

    const body = await request.json();

    if (!body.slug?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug is required.",
        },
        { status: 400 }
      );
    }

    const existingPost = getPostBySlug(body.slug);

    const result = await deletePost({
      slug: body.slug,
      title: existingPost.title,
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
      { status: 500 }
    );
  }
}