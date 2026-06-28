import {
  Env,
  updatePost,
  validateStudioSecret,
} from "../../../../lib/content";

type PagesContext = {
  request: Request;
  env: Env;
};

type EditPostRequestBody = {
  slug?: string;
  title?: string;
  content?: string;
  createdAt?: string;
};

export async function onRequestPatch({ request, env }: PagesContext) {
  try {
    const authError = validateStudioSecret(request, env);

    if (authError) {
      return authError;
    }

    const body = (await request.json()) as EditPostRequestBody;

    if (!body.slug?.trim()) {
      return Response.json(
        {
          success: false,
          error: "Slug is required.",
        },
        { status: 400 }
      );
    }

    if (!body.title?.trim()) {
      return Response.json(
        {
          success: false,
          error: "Title is required.",
        },
        { status: 400 }
      );
    }

    if (!body.createdAt?.trim()) {
      return Response.json(
        {
          success: false,
          error: "Created date is required.",
        },
        { status: 400 }
      );
    }

    const result = await updatePost(env, {
      slug: body.slug,
      title: body.title,
      content: body.content ?? "",
      createdAt: body.createdAt,
    });

    return Response.json({
      success: true,
      slug: result.slug,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}