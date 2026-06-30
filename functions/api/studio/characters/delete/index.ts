import {
  deleteCharacter,
  Env,
  validateStudioSecret,
} from "../../../../lib/content";

type PagesContext = {
  request: Request;
  env: Env;
};

type DeleteCharacterRequestBody = {
  slug?: string;
  name?: string;
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

    const body = (await request.json()) as DeleteCharacterRequestBody;

    if (!body.slug?.trim()) {
      return Response.json(
        {
          success: false,
          error: "Slug is required.",
        },
        { status: 400 }
      );
    }

    if (!body.name?.trim()) {
      return Response.json(
        {
          success: false,
          error: "Name is required.",
        },
        { status: 400 }
      );
    }

    const result = await deleteCharacter(env, {
      slug: body.slug,
      name: body.name,
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