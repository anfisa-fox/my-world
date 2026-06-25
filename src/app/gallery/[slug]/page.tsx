import { notFound } from "next/navigation";

import { getArtworkBySlug } from "@/lib/artworks";
import { formatDate } from "@/lib/formatDate";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ArtworkPage({ params }: PageProps) {
  const { slug } = await params;
  const artwork = getArtworkBySlug(slug);

  if (!artwork) {
    notFound();
  }

  const createdAt = formatDate(artwork.createdAt);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-6 font-serif text-5xl font-light text-[#2C2A26]">
        {artwork.title}
      </h1>

      <img
        src={artwork.image}
        alt={artwork.title}
        className="mb-6 h-auto w-full rounded-md"
      />

      <p className="mb-6 text-base leading-7 text-[#5F5A52]">
        {artwork.description}
      </p>

      <div className="mb-6 flex flex-wrap gap-2 font-mono text-xs text-[#8A8780]">
        {artwork.period && <span>{artwork.period}</span>}
        {artwork.period && createdAt && <span>·</span>}
        {createdAt && <span>{createdAt}</span>}
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {artwork.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[#F0EDE8] px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-[#6E6A64]"
          >
            {tag}
          </span>
        ))}
      </div>

      {artwork.story && (
        <article className="max-w-none text-base leading-8 text-[#3E3A34]">
          {artwork.story}
        </article>
      )}
    </main>
  );
}