import { Octokit } from "@octokit/rest";

import { slugify } from "@/lib/slugify";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const branch = process.env.GITHUB_BRANCH ?? "main";

type CreatePostInput = {
  title: string;
  content: string;
};

type UpdatePostInput = {
  slug: string;
  title: string;
  content: string;
  createdAt: string;
};

type DeletePostInput = {
  slug: string;
  title: string;
};

function requireGitHubConfig() {
  if (!owner || !repo || !process.env.GITHUB_TOKEN) {
    throw new Error("GitHub configuration is missing.");
  }

  return {
    owner,
    repo,
    branch,
  };
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

async function getPostFileSha({ slug }: { slug: string }) {
  const config = requireGitHubConfig();

  const response = await octokit.repos.getContent({
    owner: config.owner,
    repo: config.repo,
    ref: config.branch,
    path: `content/posts/${slug}.md`,
  });

  if (Array.isArray(response.data) || response.data.type !== "file") {
    throw new Error("Post file was not found.");
  }

  return response.data.sha;
}

export async function createPost({ title, content }: CreatePostInput) {
  const config = requireGitHubConfig();
  const slug = slugify(title);
  const createdAt = new Date().toISOString().slice(0, 10);

  if (!slug) {
    throw new Error("Could not generate slug from title.");
  }

  const markdown = createPostMarkdown({
    title,
    slug,
    content,
    createdAt,
  });

  await octokit.repos.createOrUpdateFileContents({
    owner: config.owner,
    repo: config.repo,
    branch: config.branch,
    path: `content/posts/${slug}.md`,
    message: `Creator Studio: create "${title}"`,
    content: Buffer.from(markdown).toString("base64"),
  });

  return {
    slug,
  };
}

export async function updatePost({
  slug,
  title,
  content,
  createdAt,
}: UpdatePostInput) {
  const config = requireGitHubConfig();
  const sha = await getPostFileSha({ slug });

  const markdown = createPostMarkdown({
    title,
    slug,
    content,
    createdAt,
  });

  await octokit.repos.createOrUpdateFileContents({
    owner: config.owner,
    repo: config.repo,
    branch: config.branch,
    path: `content/posts/${slug}.md`,
    message: `Creator Studio: update "${title}"`,
    content: Buffer.from(markdown).toString("base64"),
    sha,
  });

  return {
    slug,
  };
}

export async function deletePost({ slug, title }: DeletePostInput) {
  const config = requireGitHubConfig();
  const sha = await getPostFileSha({ slug });

  await octokit.repos.deleteFile({
    owner: config.owner,
    repo: config.repo,
    branch: config.branch,
    path: `content/posts/${slug}.md`,
    message: `Creator Studio: delete "${title}"`,
    sha,
  });

  return {
    slug,
  };
}