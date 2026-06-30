import { notFound } from "next/navigation";

import { AuthorCharacterActions } from "@/components/author-mode/AuthorCharacterActions";
import { getAllCharacters, getCharacterBySlug } from "@/lib/characters";
import { formatDate } from "@/lib/formatDate";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCharacters().map((character) => ({
    slug: character.slug,
  }));
}

export default async function CharacterPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const character = getCharacterBySlug(slug);

  if (!character) {
    notFound();
  }

  const createdAt = formatDate(character.createdAt);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-6 font-serif text-5xl font-light text-[#2C2A26]">
        {character.name}
      </h1>

      <AuthorCharacterActions
        slug={character.slug}
        name={character.name}
        avatar={character.avatar}
        description={character.description}
        gallery={character.gallery}
        body=""
        createdAt={character.createdAt}
      />

      <img
        src={character.avatar}
        alt={character.name}
        className="mb-6 w-full max-w-md rounded-md"
      />

      <p className="mb-6 text-base leading-7 text-[#5F5A52]">
        {character.description}
      </p>

      {createdAt && (
        <div className="mb-8 font-mono text-xs text-[#8A8780]">
          {createdAt}
        </div>
      )}

      {character.gallery.length > 0 && (
        <section>
          <h2 className="mb-4 font-serif text-3xl font-light text-[#2C2A26]">
            Gallery
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {character.gallery.map((image) => (
              <img
                key={image}
                src={image}
                alt={character.name}
                className="w-full rounded-md"
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}