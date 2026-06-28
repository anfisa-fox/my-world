import {
  createPost,
  Env,
  validateStudioSecret,
} from "../../../lib/content";

type PagesContext = {
  request: Request;
  env: Env;
};

type CreatePostRequestBody = {
  title?: string;
  content?: string;
};

export async function onRequestPost({ request, env }: PagesContext) {
  try {
    const authError = validateStudioSecret(request, env);

    if (authError) {
      return authError;
    }

    const body = (await request.json()) as CreatePostRequestBody;

    if (!body.title?.trim()) {
      return Response.json(
        {
          success: false,
          error: "Title is required.",
        },
        { status: 400 }
      );
    }

    const result = await createPost(env, {
      title: body.title,
      content: body.content ?? "",
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