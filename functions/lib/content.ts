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

function encodeBase64(value: string) {
  return btoa(unescape(encodeURIComponent(value)));
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

async function getPostFileSha(env: Env, slug: string) {
  const config = requireGitHubConfig(env);

  const data = await githubRequest({
    env,
    method: "GET",
    path: `contents/content/posts/${slug}.md?ref=${config.branch}`,
  });

  if (
    typeof data !== "object" ||
    data === null ||
    Array.isArray(data) ||
    !("sha" in data) ||
    typeof data.sha !== "string"
  ) {
    throw new Error("Post file was not found.");
  }

  return data.sha;
}

export async function createPost(env: Env, input: CreatePostInput) {
  const config = requireGitHubConfig(env);
  const slug = slugify(input.title);
  const createdAt = new Date().toISOString().slice(0, 10);

  if (!slug) {
    throw new Error("Could not generate slug from title.");
  }

  const markdown = createPostMarkdown({
    title: input.title,
    slug,
    content: input.content ?? "",
    createdAt,
  });

  await githubRequest({
    env,
    method: "PUT",
    path: `contents/content/posts/${slug}.md`,
    body: {
      message: `Creator Studio: create "${input.title}"`,
      content: encodeBase64(markdown),
      branch: config.branch,
    },
  });

  return {
    slug,
  };
}

export async function updatePost(env: Env, input: UpdatePostInput) {
  const config = requireGitHubConfig(env);
  const sha = await getPostFileSha(env, input.slug);

  const markdown = createPostMarkdown({
    title: input.title,
    slug: input.slug,
    content: input.content ?? "",
    createdAt: input.createdAt,
  });

  await githubRequest({
    env,
    method: "PUT",
    path: `contents/content/posts/${input.slug}.md`,
    body: {
      message: `Creator Studio: update "${input.title}"`,
      content: encodeBase64(markdown),
      branch: config.branch,
      sha,
    },
  });

  return {
    slug: input.slug,
  };
}

export async function deletePost(env: Env, input: DeletePostInput) {
  const config = requireGitHubConfig(env);
  const sha = await getPostFileSha(env, input.slug);

  await githubRequest({
    env,
    method: "DELETE",
    path: `contents/content/posts/${input.slug}.md`,
    body: {
      message: `Creator Studio: delete "${input.title}"`,
      branch: config.branch,
      sha,
    },
  });

  return {
    slug: input.slug,
  };
}