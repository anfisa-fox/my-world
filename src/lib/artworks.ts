import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { Artwork } from "@/types/artwork";

const artworksDirectory = path.join(process.cwd(), "content", "artworks");

function getArtworkSlugs(): string[] {
  return fs
    .readdirSync(artworksDirectory)
    .filter((fileName) => fileName.endsWith(".md"));
}

function getSlugFromFileName(fileName: string): string {
  return fileName.replace(/\.md$/, "");
}

function getCreatedAtTime(value: string | undefined): number {
  if (!value) {
    return 0;
  }

  const time = new Date(value).getTime();

  return Number.isNaN(time) ? 0 : time;
}

export function getArtworkBySlug(slug: string): Artwork {
  if (!slug) {
    throw new Error("Slug is required");
  }

  const filePath = path.join(artworksDirectory, `${slug}.md`);

  const fileContents = fs.readFileSync(filePath, "utf8");

  const { data } = matter(fileContents);

  return {
    slug,
    title: data.title,
    image: data.image,
    description: data.description,
    tags: data.tags ?? [],
    period: data.period,
    featured: data.featured ?? false,
    createdAt: data.createdAt,
    story: data.story ?? "",
  };
}

export function getAllArtworks(): Artwork[] {
  return getArtworkSlugs()
    .map((fileName) => {
      const slug = getSlugFromFileName(fileName);
      return getArtworkBySlug(slug);
    })
    .sort(
      (a, b) =>
        getCreatedAtTime(b.createdAt) - getCreatedAtTime(a.createdAt)
    );
}