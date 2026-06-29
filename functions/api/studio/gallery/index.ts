import {
  createArtwork,
  createArtworkWithImage,
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

function parseTags(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

async function createArtworkFromFormData(request: Request, env: Env) {
  const formData = await request.formData();

  const title = formData.get("title");
  const description = formData.get("description");
  const tags = formData.get("tags");
  const period = formData.get("period");
  const image = formData.get("image");

  if (typeof title !== "string" || !title.trim()) {
    return Response.json(
      {
        success: false,
        error: "Title is required.",
      },
      { status: 400 }
    );
  }

  if (!(image instanceof File)) {
    return Response.json(
      {
        success: false,
        error: "Image file is required.",
      },
      { status: 400 }
    );
  }

  const result = await createArtworkWithImage(env, {
    title,
    imageFile: image,
    description: typeof description === "string" ? description : "",
    tags: parseTags(tags),
    period: typeof period === "string" ? period : "",
    featured: false,
    story: "",
  });

  return Response.json({
    success: true,
    slug: result.slug,
  });
}

async function createArtworkFromJson(request: Request, env: Env) {
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
}

export async function onRequestPost({ request, env }: PagesContext) {
  try {
    const authError = validateStudioSecret(request, env);

    if (authError) {
      return authError;
    }

    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      return createArtworkFromFormData(request, env);
    }

    return createArtworkFromJson(request, env);
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