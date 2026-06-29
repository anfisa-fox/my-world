import {
  createArtwork,
  Env,
  validateStudioSecret,
} from "../../../lib/content";

type PagesContext = {
  request: Request;
  env: Env;
};

type CreateArtworkRequestBody = {
  title?: string;
  image?: string;
  description?: string;
  tags?: string[];
  period?: string;
  featured?: boolean;
  story?: string;
};

export async function onRequestPost({ request, env }: PagesContext) {
  try {
    const authError = validateStudioSecret(request, env);

    if (authError) {
      return authError;
    }

    const body = (await request.json()) as CreateArtworkRequestBody;

    if (!body.title?.trim()) {
      return Response.json(
        {
          success: false,
          error: "Title is required.",
        },
        { status: 400 }
      );
    }

    if (!body.image?.trim()) {
      return Response.json(
        {
          success: false,
          error: "Image is required.",
        },
        { status: 400 }
      );
    }

    const result = await createArtwork(env, {
      title: body.title,
      image: body.image,
      description: body.description ?? "",
      tags: Array.isArray(body.tags) ? body.tags : [],
      period: body.period ?? "",
      featured: body.featured ?? false,
      story: body.story ?? "",
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