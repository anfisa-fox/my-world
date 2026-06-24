import { getAllArtworks } from "@/lib/artworks";

export default function GalleryPage() {
  const artworks = getAllArtworks();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Gallery
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {artworks.map((art) => (
          <a
            key={art.slug}
            href={`/gallery/${art.slug}`}
            className="border rounded p-4 hover:shadow"
          >
            <img
              src={art.image}
              alt={art.title}
              className="w-full h-48 object-cover mb-2"
            />
            <h2 className="text-lg font-semibold">
              {art.title}
            </h2>
            <p className="text-sm text-gray-600">
              {art.description}
            </p>
          </a>
        ))}
      </div>
    </main>
  );
}
