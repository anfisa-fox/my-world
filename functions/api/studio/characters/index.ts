import {
  createCharacter,
  createCharacterWithAvatar,
  Env,
  validateStudioSecret,
} from "../../../lib/content";

type PagesContext = {
  request: Request;
  env: Env;
};

type CreateCharacterRequestBody = {
  name?: string;
  avatar?: string;
  description?: string;
  gallery?: string[];
  body?: string;
};

async function createCharacterFromFormData(request: Request, env: Env) {
  const formData = await request.formData();

  const name = formData.get("name");
  const description = formData.get("description");
  const body = formData.get("body");
  const avatar = formData.get("avatar");

  if (typeof name !== "string" || !name.trim()) {
    return Response.json(
      {
        success: false,
        error: "Name is required.",
      },
      { status: 400 }
    );
  }

  if (!(avatar instanceof File)) {
    return Response.json(
      {
        success: false,
        error: "Avatar file is required.",
      },
      { status: 400 }
    );
  }

  const result = await createCharacterWithAvatar(env, {
    name,
    avatarFile: avatar,
    description: typeof description === "string" ? description : "",
    gallery: [],
    body: typeof body === "string" ? body : "",
  });

  return Response.json({
    success: true,
    slug: result.slug,
  });
}

async function createCharacterFromJson(request: Request, env: Env) {
  const body = (await request.json()) as CreateCharacterRequestBody;

  if (!body.name?.trim()) {
    return Response.json(
      {
        success: false,
        error: "Name is required.",
      },
      { status: 400 }
    );
  }

  if (!body.avatar?.trim()) {
    return Response.json(
      {
        success: false,
        error: "Avatar is required.",
      },
      { status: 400 }
    );
  }

  const result = await createCharacter(env, {
    name: body.name,
    avatar: body.avatar,
    description: body.description ?? "",
    gallery: Array.isArray(body.gallery) ? body.gallery : [],
    body: body.body ?? "",
  });

  return Response.json({
    success: true,
    slug: result.slug,
  });
}

export async function onRequestPost({ request, env }: PagesContext) {
  try {
    const authError = validateStudioSecret(request, env);

    if (authError) {
      return authError;
    }

    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      return createCharacterFromFormData(request, env);
    }

    return createCharacterFromJson(request, env);
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