import Link from "next/link";

import { getAllArtworks } from "@/lib/artworks";

export default function GalleryPage() {
  const artworks = getAllArtworks();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-10 font-serif text-5xl font-light text-[#2C2A26]">
        Gallery
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {artworks.map((art) => (
          <Link
            key={art.slug}
            href={`/gallery/${art.slug}`}
            className="group"
          >
            <article className="overflow-hidden rounded-md bg-white transition-transform duration-200 group-hover:-translate-y-1">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={art.image}
                  alt={art.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>

              <div className="pt-4">
                <h2 className="font-serif text-2xl font-light text-[#2C2A26]">
                  {art.title}
                </h2>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#6E6A64]">
                  {art.description}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}