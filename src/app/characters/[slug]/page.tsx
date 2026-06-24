import { notFound } from "next/navigation";

import { getCharacterBySlug } from "@/lib/characters";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CharacterPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const character = getCharacterBySlug(slug);

  if (!character) {
    notFound();
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        {character.name}
      </h1>

      <img
        src={character.avatar}
        alt={character.name}
        className="w-full max-w-md rounded mb-6"
      />

      <p className="text-gray-700 mb-4">
        {character.description}
      </p>

      <div className="text-sm text-gray-500 mb-8">
        Created: {String(character.createdAt)}
      </div>

      {character.gallery.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-4">
            Gallery
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {character.gallery.map((image) => (
              <img
                key={image}
                src={image}
                alt={character.name}
                className="w-full rounded"
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}