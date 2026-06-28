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
}: CreatePostInput & { slug: string }) {
  const createdAt = new Date().toISOString().slice(0, 10);

  return `---
title: ${toYamlString(title)}
slug: ${toYamlString(slug)}
content: ${toYamlString(content)}
createdAt: ${toYamlString(createdAt)}
---
`;
}

export async function createPost({ title, content }: CreatePostInput) {
  const config = requireGitHubConfig();
  const slug = slugify(title);

  if (!slug) {
    throw new Error("Could not generate slug from title.");
  }

  const markdown = createPostMarkdown({
    title,
    slug,
    content,
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