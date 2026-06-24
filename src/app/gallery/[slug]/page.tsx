import { notFound } from "next/navigation";

import { getArtworkBySlug } from "@/lib/artworks";

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

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        {artwork.title}
      </h1>

      <img
        src={artwork.image}
        alt={artwork.title}
        className="w-full h-auto mb-4 rounded"
      />

      <p className="text-gray-700 mb-4">
        {artwork.description}
      </p>

      <div className="text-sm text-gray-500 mb-2">
        Period: {artwork.period}
      </div>

      <div className="text-sm text-gray-500 mb-6">
        Created: {String(artwork.createdAt)}
      </div>

      <div className="mb-6">
        {artwork.tags.map((tag) => (
          <span
            key={tag}
            className="inline-block mr-2 text-xs bg-gray-200 px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      <article className="prose">
        {artwork.story}
      </article>
    </main>
  );
}