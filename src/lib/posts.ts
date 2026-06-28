import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { Post } from "@/types/post";

const postsDirectory = path.join(
  process.cwd(),
  "content",
  "posts"
);

function getPostSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".md"));
}

function getSlugFromFileName(fileName: string): string {
  return fileName.replace(/\.md$/, "");
}

export function getPostBySlug(slug: string): Post {
  if (!slug) {
    throw new Error("Slug is required");
  }

  const filePath = path.join(
    postsDirectory,
    `${slug}.md`
  );

  const fileContents = fs.readFileSync(
    filePath,
    "utf8"
  );

  const { data } = matter(fileContents);

  return {
    slug,
    title: data.title,
    image: data.image,
    content: data.content ?? "",
    createdAt: data.createdAt,
  };
}

export function getAllPosts(): Post[] {
  return getPostSlugs()
    .map((fileName) => {
      const slug = getSlugFromFileName(fileName);
      return getPostBySlug(slug);
    })
    .sort((firstPost, secondPost) => {
      return (
        new Date(secondPost.createdAt).getTime() -
        new Date(firstPost.createdAt).getTime()
      );
    });
}