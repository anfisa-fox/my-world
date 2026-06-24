import Link from "next/link";

import { getAllCharacters } from "@/lib/characters";

export default function CharactersPage() {
  const characters = getAllCharacters();

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">
        Characters
      </h1>

      <div className="grid gap-6">
        {characters.map((character) => (
          <Link
            key={character.slug}
            href={`/characters/${character.slug}`}
            className="block border rounded-lg p-4 hover:bg-gray-50"
          >
            <div className="flex gap-4 items-center">
              <img
                src={character.avatar}
                alt={character.name}
                className="w-20 h-20 object-cover rounded"
              />

              <div>
                <h2 className="text-xl font-semibold">
                  {character.name}
                </h2>

                <p className="text-gray-600">
                  {character.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}