import {
  Env,
  updateArtwork,
  uploadArtworkImage,
  validateStudioSecret,
} from "../../../../lib/content";

type PagesContext = {
  request: Request;
  env: Env;
};

function parseTags(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseFeatured(value: FormDataEntryValue | null): boolean {
  return value === "true";
}

export async function onRequestPatch({ request, env }: PagesContext) {
  try {
    const authError = validateStudioSecret(request, env);

    if (authError) {
      return authError;
    }

    const formData = await request.formData();

    const slug = formData.get("slug");
    const title = formData.get("title");
    const image = formData.get("image");
    const description = formData.get("description");
    const story = formData.get("story");
    const tags = formData.get("tags");
    const period = formData.get("period");
    const featured = formData.get("featured");
    const createdAt = formData.get("createdAt");
    const imageFile = formData.get("imageFile");

    if (typeof slug !== "string" || !slug.trim()) {
      return Response.json(
        { success: false, error: "Slug is required." },
        { status: 400 },
      );
    }

    if (typeof title !== "string" || !title.trim()) {
      return Response.json(
        { success: false, error: "Title is required." },
        { status: 400 },
      );
    }

    if (typeof image !== "string" || !image.trim()) {
      return Response.json(
        { success: false, error: "Image is required." },
        { status: 400 },
      );
    }

    if (typeof createdAt !== "string" || !createdAt.trim()) {
      return Response.json(
        { success: false, error: "Created date is required." },
        { status: 400 },
      );
    }

    let nextImage = image;

    if (imageFile instanceof File && imageFile.size > 0) {
      const uploadResult = await uploadArtworkImage(env, {
        slug,
        title,
        imageFile,
      });

      nextImage = uploadResult.imagePath;
    }

    const result = await updateArtwork(env, {
      slug,
      title,
      image: nextImage,
      description: typeof description === "string" ? description : "",
      story: typeof story === "string" ? story : "",
      tags: parseTags(tags),
      period: typeof period === "string" ? period : "",
      featured: parseFeatured(featured),
      createdAt,
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
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}