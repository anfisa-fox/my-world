import {
  Env,
  updateCharacter,
  uploadCharacterAvatar,
  validateStudioSecret,
} from "../../../../lib/content";

type PagesContext = {
  request: Request;
  env: Env;
};

function parseGallery(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function onRequestPatch({ request, env }: PagesContext) {
  try {
    const authError = validateStudioSecret(request, env);

    if (authError) {
      return authError;
    }

    const formData = await request.formData();

    const slug = formData.get("slug");
    const name = formData.get("name");
    const avatar = formData.get("avatar");
    const description = formData.get("description");
    const gallery = formData.get("gallery");
    const body = formData.get("body");
    const createdAt = formData.get("createdAt");
    const avatarFile = formData.get("avatarFile");

    if (typeof slug !== "string" || !slug.trim()) {
      return Response.json(
        { success: false, error: "Slug is required." },
        { status: 400 },
      );
    }

    if (typeof name !== "string" || !name.trim()) {
      return Response.json(
        { success: false, error: "Name is required." },
        { status: 400 },
      );
    }

    if (typeof avatar !== "string" || !avatar.trim()) {
      return Response.json(
        { success: false, error: "Avatar is required." },
        { status: 400 },
      );
    }

    if (typeof createdAt !== "string" || !createdAt.trim()) {
      return Response.json(
        { success: false, error: "Created date is required." },
        { status: 400 },
      );
    }

    let nextAvatar = avatar;

    if (avatarFile instanceof File && avatarFile.size > 0) {
      const uploadResult = await uploadCharacterAvatar(env, {
        slug,
        name,
        avatarFile,
      });

      nextAvatar = uploadResult.avatarPath;
    }

    const result = await updateCharacter(env, {
      slug,
      name,
      avatar: nextAvatar,
      description: typeof description === "string" ? description : "",
      gallery: parseGallery(gallery),
      body: typeof body === "string" ? body : "",
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