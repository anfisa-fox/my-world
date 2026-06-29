export type Env = {
  GITHUB_TOKEN?: string;
  GITHUB_OWNER?: string;
  GITHUB_REPO?: string;
  GITHUB_BRANCH?: string;
  STUDIO_SECRET?: string;
};

export type CreatePostInput = {
  title: string;
  content: string;
};

export type UpdatePostInput = {
  slug: string;
  title: string;
  content: string;
  createdAt: string;
};

export type DeletePostInput = {
  slug: string;
  title: string;
};

export type CreateArtworkInput = {
  title: string;
  image: string;
  description: string;
  tags: string[];
  period: string;
  featured: boolean;
  story?: string;
};

export type CreateArtworkWithImageInput = {
  title: string;
  imageFile: File;
  description: string;
  tags: string[];
  period: string;
  featured?: boolean;
  story?: string;
};

export type CreateCharacterInput = {
  name: string;
  avatar: string;
  description: string;
  gallery: string[];
  body?: string;
};

export type CreateCharacterWithAvatarInput = {
  name: string;
  avatarFile: File;
  description: string;
  gallery?: string[];
  body?: string;
};

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp"] as const;

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export function validateStudioSecret(request: Request, env: Env) {
  const studioSecret = request.headers.get("x-studio-secret");

  if (!env.STUDIO_SECRET) {
    return Response.json(
      {
        success: false,
        error: "Studio secret is not configured.",
      },
      { status: 500 }
    );
  }

  if (studioSecret !== env.STUDIO_SECRET) {
    return Response.json(
      {
        success: false,
        error: "Invalid Studio secret.",
      },
      { status: 401 }
    );
  }

  return null;
}

function requireGitHubConfig(env: Env) {
  if (!env.GITHUB_OWNER || !env.GITHUB_REPO || !env.GITHUB_TOKEN) {
    throw new Error("GitHub configuration is missing.");
  }

  return {
    owner: env.GITHUB_OWNER,
    repo: env.GITHUB_REPO,
    branch: env.GITHUB_BRANCH ?? "main",
    token: env.GITHUB_TOKEN,
  };
}

function slugify(value: string) {
  const transliterationMap: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };

  return value
    .trim()
    .toLowerCase()
    .split("")
    .map((character) => transliterationMap[character] ?? character)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toYamlString(value: string) {
  return JSON.stringify(value);
}

function toYamlBoolean(value: boolean) {
  return value ? "true" : "false";
}

function toYamlStringArray(values: string[]) {
  return `[${values.map((value) => toYamlString(value)).join(", ")}]`;
}

function createPostMarkdown({
  title,
  slug,
  content,
  createdAt,
}: CreatePostInput & { slug: string; createdAt: string }) {
  return `---
title: ${toYamlString(title)}
slug: ${toYamlString(slug)}
content: ${toYamlString(content)}
createdAt: ${toYamlString(createdAt)}
---
`;
}

function createArtworkMarkdown({
  title,
  slug,
  image,
  description,
  tags,
  period,
  featured,
  story,
  createdAt,
}: CreateArtworkInput & { slug: string; createdAt: string }) {
  return `---
title: ${toYamlString(title)}
slug: ${toYamlString(slug)}
image: ${toYamlString(image)}
description: ${toYamlString(description)}
tags: ${toYamlStringArray(tags)}
period: ${toYamlString(period)}
featured: ${toYamlBoolean(featured)}
createdAt: ${toYamlString(createdAt)}
story: ${toYamlString(story ?? "")}
---
`;
}

function createCharacterMarkdown({
  name,
  slug,
  avatar,
  description,
  gallery,
  body,
  createdAt,
}: CreateCharacterInput & { slug: string; createdAt: string }) {
  return `---
name: ${toYamlString(name)}
avatar: ${toYamlString(avatar)}
description: ${toYamlString(description)}
gallery: ${toYamlStringArray(gallery)}
createdAt: ${toYamlString(createdAt)}
---

${body ?? ""}
`;
}

function encodeBase64(value: string) {
  return btoa(unescape(encodeURIComponent(value)));
}

function encodeArrayBufferBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function getImageExtension(file: File) {
  const extensionFromType = ALLOWED_IMAGE_TYPES[file.type];

  if (extensionFromType) {
    return extensionFromType;
  }

  const extensionFromName = file.name.split(".").pop()?.toLowerCase();

  if (
    extensionFromName &&
    ALLOWED_IMAGE_EXTENSIONS.includes(
      extensionFromName as (typeof ALLOWED_IMAGE_EXTENSIONS)[number]
    )
  ) {
    return extensionFromName;
  }

  throw new Error("Unsupported image type.");
}

async function validateImageFile(file: File) {
  if (file.size <= 0) {
    throw new Error("Image file is empty.");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Image file is too large. Maximum size is 5 MB.");
  }

  getImageExtension(file);
}

async function githubRequest({
  env,
  path,
  method,
  body,
}: {
  env: Env;
  path: string;
  method: "GET" | "PUT" | "DELETE";
  body?: unknown;
}) {
  const config = requireGitHubConfig(env);

  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/${path}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "User-Agent": "personal-creative-world",
      },
      body: body ? JSON.stringify(body) : undefined,
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status}`);
  }

  return response.json();
}

async function getFileSha(env: Env, folder: string, slug: string) {
  const config = requireGitHubConfig(env);

  const data = await githubRequest({
    env,
    method: "GET",
    path: `contents/content/${folder}/${slug}.md?ref=${config.branch}`,
  });

  if (
    typeof data !== "object" ||
    data === null ||
    Array.isArray(data) ||
    !("sha" in data) ||
    typeof data.sha !== "string"
  ) {
    throw new Error("Content file was not found.");
  }

  return data.sha;
}

async function putMarkdown({
  env,
  folder,
  slug,
  title,
  markdown,
  action,
  sha,
}: {
  env: Env;
  folder: string;
  slug: string;
  title: string;
  markdown: string;
  action: "create" | "update";
  sha?: string;
}) {
  const config = requireGitHubConfig(env);

  await githubRequest({
    env,
    method: "PUT",
    path: `contents/content/${folder}/${slug}.md`,
    body: {
      message: `Creator Studio: ${action} "${title}"`,
      content: encodeBase64(markdown),
      branch: config.branch,
      ...(sha ? { sha } : {}),
    },
  });

  return {
    slug,
  };
}

async function putBinaryFile({
  env,
  path,
  title,
  content,
}: {
  env: Env;
  path: string;
  title: string;
  content: string;
}) {
  const config = requireGitHubConfig(env);

  await githubRequest({
    env,
    method: "PUT",
    path: `contents/${path}`,
    body: {
      message: `Creator Studio: upload image for "${title}"`,
      content,
      branch: config.branch,
    },
  });
}

async function deleteMarkdown({
  env,
  folder,
  slug,
  title,
}: {
  env: Env;
  folder: string;
  slug: string;
  title: string;
}) {
  const config = requireGitHubConfig(env);
  const sha = await getFileSha(env, folder, slug);

  await githubRequest({
    env,
    method: "DELETE",
    path: `contents/content/${folder}/${slug}.md`,
    body: {
      message: `Creator Studio: delete "${title}"`,
      branch: config.branch,
      sha,
    },
  });

  return {
    slug,
  };
}

export async function createPost(env: Env, input: CreatePostInput) {
  const slug = slugify(input.title);
  const createdAt = new Date().toISOString();

  if (!slug) {
    throw new Error("Could not generate slug from title.");
  }

  const markdown = createPostMarkdown({
    title: input.title,
    slug,
    content: input.content ?? "",
    createdAt,
  });

  return putMarkdown({
    env,
    folder: "posts",
    slug,
    title: input.title,
    markdown,
    action: "create",
  });
}

export async function updatePost(env: Env, input: UpdatePostInput) {
  const sha = await getFileSha(env, "posts", input.slug);

  const markdown = createPostMarkdown({
    title: input.title,
    slug: input.slug,
    content: input.content ?? "",
    createdAt: input.createdAt,
  });

  return putMarkdown({
    env,
    folder: "posts",
    slug: input.slug,
    title: input.title,
    markdown,
    action: "update",
    sha,
  });
}

export async function deletePost(env: Env, input: DeletePostInput) {
  return deleteMarkdown({
    env,
    folder: "posts",
    slug: input.slug,
    title: input.title,
  });
}

export async function createArtwork(env: Env, input: CreateArtworkInput) {
  const slug = slugify(input.title);
  const createdAt = new Date().toISOString();

  if (!slug) {
    throw new Error("Could not generate slug from title.");
  }

  const markdown = createArtworkMarkdown({
    title: input.title,
    slug,
    image: input.image ?? "",
    description: input.description ?? "",
    tags: input.tags ?? [],
    period: input.period ?? "",
    featured: input.featured ?? false,
    story: input.story ?? "",
    createdAt,
  });

  return putMarkdown({
    env,
    folder: "artworks",
    slug,
    title: input.title,
    markdown,
    action: "create",
  });
}

export async function createArtworkWithImage(
  env: Env,
  input: CreateArtworkWithImageInput
) {
  const slug = slugify(input.title);
  const createdAt = new Date().toISOString();

  if (!slug) {
    throw new Error("Could not generate slug from title.");
  }

  await validateImageFile(input.imageFile);

  const extension = getImageExtension(input.imageFile);
  const imagePath = `/images/artworks/${slug}.${extension}`;
  const repositoryImagePath = `public/images/artworks/${slug}.${extension}`;
  const imageContent = encodeArrayBufferBase64(await input.imageFile.arrayBuffer());

  await putBinaryFile({
    env,
    path: repositoryImagePath,
    title: input.title,
    content: imageContent,
  });

  const markdown = createArtworkMarkdown({
    title: input.title,
    slug,
    image: imagePath,
    description: input.description ?? "",
    tags: input.tags ?? [],
    period: input.period ?? "",
    featured: input.featured ?? false,
    story: input.story ?? "",
    createdAt,
  });

  return putMarkdown({
    env,
    folder: "artworks",
    slug,
    title: input.title,
    markdown,
    action: "create",
  });
}

export async function createCharacter(env: Env, input: CreateCharacterInput) {
  const slug = slugify(input.name);
  const createdAt = new Date().toISOString();

  if (!slug) {
    throw new Error("Could not generate slug from name.");
  }

  const markdown = createCharacterMarkdown({
    name: input.name,
    slug,
    avatar: input.avatar ?? "",
    description: input.description ?? "",
    gallery: input.gallery ?? [],
    body: input.body ?? "",
    createdAt,
  });

  return putMarkdown({
    env,
    folder: "characters",
    slug,
    title: input.name,
    markdown,
    action: "create",
  });
}

export async function createCharacterWithAvatar(
  env: Env,
  input: CreateCharacterWithAvatarInput
) {
  const slug = slugify(input.name);
  const createdAt = new Date().toISOString();

  if (!slug) {
    throw new Error("Could not generate slug from name.");
  }

  await validateImageFile(input.avatarFile);

  const extension = getImageExtension(input.avatarFile);
  const avatarPath = `/images/characters/${slug}/avatar.${extension}`;
  const repositoryAvatarPath = `public/images/characters/${slug}/avatar.${extension}`;
  const avatarContent = encodeArrayBufferBase64(
    await input.avatarFile.arrayBuffer()
  );

  await putBinaryFile({
    env,
    path: repositoryAvatarPath,
    title: input.name,
    content: avatarContent,
  });

  const markdown = createCharacterMarkdown({
    name: input.name,
    slug,
    avatar: avatarPath,
    description: input.description ?? "",
    gallery: input.gallery ?? [],
    body: input.body ?? "",
    createdAt,
  });

  return putMarkdown({
    env,
    folder: "characters",
    slug,
    title: input.name,
    markdown,
    action: "create",
  });
}