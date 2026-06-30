import {
  deleteArtwork,
  Env,
  validateStudioSecret,
} from "../../../../lib/content";

type PagesContext = {
  request: Request;
  env: Env;
};

type DeleteArtworkRequestBody = {
  slug?: string;
  title?: string;
};

export async function onRequestDelete({
  request,
  env,
}: PagesContext) {
  try {
    const authError = validateStudioSecret(request, env);

    if (authError) {
      return authError;
    }

    const body = (await request.json()) as DeleteArtworkRequestBody;

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

    const result = await deleteArtwork(env, {
      slug: body.slug,
      title: body.title,
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