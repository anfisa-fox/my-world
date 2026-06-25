import Link from "next/link";

import { getAllCharacters } from "@/lib/characters";

export default function CharactersPage() {
  const characters = getAllCharacters();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-10 font-serif text-5xl font-light text-[#2C2A26]">
        Characters
      </h1>

      <div className="space-y-6">
        {characters.map((character) => (
          <Link
            key={character.slug}
            href={`/characters/${character.slug}`}
            className="group block transition-transform duration-200 hover:-translate-y-0.5"
          >
            <article className="flex items-center gap-5 rounded-md bg-white p-2">
              <img
                src={character.avatar}
                alt={character.name}
                className="h-20 w-20 rounded-full object-cover"
              />

              <div className="min-w-0">
                <h2 className="font-serif text-3xl font-light text-[#2C2A26] transition-colors group-hover:text-[#6B8A6B]">
                  {character.name}
                </h2>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6E6A64]">
                  {character.description}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}