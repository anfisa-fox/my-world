import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { Character } from "@/types/character";

const charactersDirectory = path.join(
  process.cwd(),
  "content",
  "characters"
);

function getCharacterSlugs(): string[] {
  return fs
    .readdirSync(charactersDirectory)
    .filter((fileName) => fileName.endsWith(".md"));
}

function getSlugFromFileName(fileName: string): string {
  return fileName.replace(/\.md$/, "");
}

export function getCharacterBySlug(slug: string): Character {
  if (!slug) {
    throw new Error("Slug is required");
  }

  const filePath = path.join(
    charactersDirectory,
    `${slug}.md`
  );

  const fileContents = fs.readFileSync(
    filePath,
    "utf8"
  );

  const { data } = matter(fileContents);

  return {
    slug,
    name: data.name,
    avatar: data.avatar,
    description: data.description,
    gallery: data.gallery ?? [],
    createdAt: data.createdAt,
  };
}

export function getAllCharacters(): Character[] {
  return getCharacterSlugs()
    .map((fileName) => {
      const slug = getSlugFromFileName(fileName);
      return getCharacterBySlug(slug);
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
}