type Env = {
  STUDIO_SECRET: string;
  GITHUB_TOKEN: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  GITHUB_BRANCH: string;
};

type PagesFunctionContext = {
  request: Request;
  env: Env;
};

type CreatePostBody = {
  title?: string;
  content?: string;
};

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

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .split("")
    .map((char) => transliterationMap[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export async function onRequestPost(context: PagesFunctionContext) {
  const { request, env } = context;

  const studioSecret = request.headers.get("x-studio-secret");

  if (!env.STUDIO_SECRET || studioSecret !== env.STUDIO_SECRET) {
    return json({ success: false, error: "Invalid Studio secret." }, 401);
  }

  const body = (await request.json()) as CreatePostBody;
  const title = body.title?.trim();
  const content = body.content?.trim() ?? "";

  if (!title) {
    return json({ success: false, error: "Title is required." }, 400);
  }

  const slug = slugify(title);

  if (!slug) {
    return json({ success: false, error: "Could not generate slug." }, 400);
  }

  const createdAt = new Date().toISOString().slice(0, 10);

  const markdown = `---
title: ${title}
slug: ${slug}
content: ${content}
createdAt: ${createdAt}
---
`;

  const response = await fetch(
    `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/content/posts/${slug}.md`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "User-Agent": "personal-creative-world-studio",
      },
      body: JSON.stringify({
        message: `Creator Studio: create "${title}"`,
        branch: env.GITHUB_BRANCH || "main",
        content: btoa(unescape(encodeURIComponent(markdown))),
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();

    return json(
      {
        success: false,
        error,
      },
      response.status
    );
  }

  return json({
    success: true,
    slug,
  });
}