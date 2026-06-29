"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { useAuthorMode } from "@/components/author-mode/AuthorModeProvider";

type SubmitState = "idle" | "saving" | "error";

type PendingCharacter = {
  id: string;
  slug: string;
  name: string;
  createdAt: number;
};

type CharactersAuthorModeProps = {
  publishedCharacterSlugs: string[];
};

type CreateCharacterResponse = {
  success?: boolean;
  slug?: string;
  error?: string;
};

const PENDING_CHARACTERS_STORAGE_KEY = "characters-pending-characters";
const PENDING_CHARACTER_TTL_MS = 10 * 60 * 1000;

function createPendingCharacterId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeSlug(value: string) {
  return value.trim().toLowerCase();
}

function getFreshPendingCharacters(
  characters: PendingCharacter[],
  publishedCharacterSlugs: string[] = []
) {
  const now = Date.now();
  const publishedSlugSet = new Set(publishedCharacterSlugs.map(normalizeSlug));

  return characters.filter((character) => {
    const isFresh = now - character.createdAt < PENDING_CHARACTER_TTL_MS;
    const isPublished = publishedSlugSet.has(normalizeSlug(character.slug));

    return isFresh && !isPublished;
  });
}

function parsePendingCharacter(item: unknown): PendingCharacter | null {
  if (typeof item !== "object" || item === null) {
    return null;
  }

  if (!("name" in item) || typeof item.name !== "string") {
    return null;
  }

  if (!("createdAt" in item) || typeof item.createdAt !== "number") {
    return null;
  }

  const id =
    "id" in item && typeof item.id === "string"
      ? item.id
      : `${item.createdAt}-${item.name}`;

  const slug =
    "slug" in item && typeof item.slug === "string" ? item.slug : "";

  return {
    id,
    slug,
    name: item.name,
    createdAt: item.createdAt,
  };
}

function readPendingCharactersFromSessionStorage(
  publishedCharacterSlugs: string[] = []
): PendingCharacter[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.sessionStorage.getItem(
      PENDING_CHARACTERS_STORAGE_KEY
    );

    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return getFreshPendingCharacters(
      parsedValue
        .map((item) => parsePendingCharacter(item))
        .filter((item): item is PendingCharacter => item !== null),
      publishedCharacterSlugs
    );
  } catch {
    return [];
  }
}

function writePendingCharactersToSessionStorage(
  characters: PendingCharacter[],
  publishedCharacterSlugs: string[] = []
) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    PENDING_CHARACTERS_STORAGE_KEY,
    JSON.stringify(getFreshPendingCharacters(characters, publishedCharacterSlugs))
  );
}

export function CharactersAuthorMode({
  publishedCharacterSlugs,
}: CharactersAuthorModeProps) {
  const { isAuthorMode, studioSecret } = useAuthorMode();

  const [isOpen, setIsOpen] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [pendingCharacters, setPendingCharacters] = useState<
    PendingCharacter[]
  >([]);

  const stablePublishedCharacterSlugs = useMemo(
    () => publishedCharacterSlugs.map(normalizeSlug),
    [publishedCharacterSlugs]
  );

  useEffect(() => {
    const freshPendingCharacters = readPendingCharactersFromSessionStorage(
      stablePublishedCharacterSlugs
    );

    setPendingCharacters(freshPendingCharacters);
    writePendingCharactersToSessionStorage(
      freshPendingCharacters,
      stablePublishedCharacterSlugs
    );
  }, [stablePublishedCharacterSlugs]);

  if (!isAuthorMode) {
    return null;
  }

  function addPendingCharacter({
    slug,
    name,
  }: {
    slug: string;
    name: string;
  }) {
    const pendingCharacter: PendingCharacter = {
      id: createPendingCharacterId(),
      slug,
      name,
      createdAt: Date.now(),
    };

    setPendingCharacters((currentPendingCharacters) => {
      const freshPendingCharacters = getFreshPendingCharacters(
        [pendingCharacter, ...currentPendingCharacters],
        stablePublishedCharacterSlugs
      );

      writePendingCharactersToSessionStorage(
        freshPendingCharacters,
        stablePublishedCharacterSlugs
      );

      return freshPendingCharacters;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!studioSecret) {
      setSubmitState("error");
      setMessage("Кажется, я больше не узнаю тебя. Попробуем войти ещё раз?");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name");

    setSubmitState("saving");
    setMessage("Секундочку, я сохраняю нового персонажа.");

    try {
      const response = await fetch("/api/studio/characters", {
        method: "POST",
        headers: {
          "x-studio-secret": studioSecret,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Could not publish character.");
      }

      const result = (await response.json()) as CreateCharacterResponse;

      if (!result.slug) {
        throw new Error("Character slug was not returned.");
      }

      form.reset();
      addPendingCharacter({
        slug: result.slug,
        name: typeof name === "string" ? name : "Новый персонаж",
      });
      setIsOpen(false);
      setSubmitState("idle");
      setMessage("");
    } catch {
      setSubmitState("error");
      setMessage("Кажется, что-то пошло не так. Попробуем ещё раз?");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setSubmitState("idle");
          setMessage("");
        }}
        className="w-full rounded-md border border-dashed border-[#D8D1C7] bg-white/60 px-6 py-8 text-left transition hover:-translate-y-0.5 hover:bg-white"
      >
        <div className="flex items-center gap-5">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EEF3ED] font-serif text-4xl font-light text-[#8BA888]">
            ＋
          </span>

          <div className="min-w-0">
            <span className="font-serif text-3xl font-light text-[#2C2A26]">
              Добавить персонажа
            </span>

            <p className="mt-2 text-sm leading-6 text-[#6E6A64]">
              Кто сегодня появится в этом мире?
            </p>
          </div>
        </div>
      </button>

      {pendingCharacters.map((pendingCharacter) => (
        <article
          key={pendingCharacter.id}
          className="rounded-md border border-dashed border-[#D8D1C7] bg-white/70 px-6 py-8"
        >
          <div className="flex items-center gap-5">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EEF3ED] font-serif text-3xl font-light text-[#8BA888]">
              ✦
            </span>

            <div className="min-w-0">
              <h2 className="font-serif text-3xl font-light text-[#2C2A26]">
                {pendingCharacter.name}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#6E6A64]">
                Персонаж отправлен на публикацию. Он появится здесь через 1–2
                минуты.
              </p>
            </div>
          </div>
        </article>
      ))}

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C2A26]/30 px-4 py-8 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-[#FAFAF8] p-6 shadow-xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-3xl font-light text-[#2C2A26]">
                  Добавить персонажа
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#6E6A64]">
                  Я помогу бережно добавить нового героя в этот мир.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full px-3 py-1 text-xl text-[#6E6A64] hover:bg-white"
                aria-label="Закрыть"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="text-sm text-[#6E6A64]">
                  Как зовут персонажа?
                </span>

                <input
                  name="name"
                  required
                  className="mt-2 w-full rounded-md border border-[#D8D1C7] bg-white px-4 py-3 text-[#2C2A26] outline-none focus:border-[#8BA888]"
                />
              </label>

              <label className="block">
                <span className="text-sm text-[#6E6A64]">
                  Выбрать портрет персонажа
                </span>

                <input
                  name="avatar"
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                  required
                  className="mt-2 w-full rounded-md border border-[#D8D1C7] bg-white px-4 py-3 text-sm text-[#2C2A26] outline-none file:mr-4 file:rounded-full file:border-0 file:bg-[#EEF3ED] file:px-4 file:py-2 file:text-[#2C2A26]"
                />
              </label>

              <label className="block">
                <span className="text-sm text-[#6E6A64]">
                  Короткое описание
                </span>

                <textarea
                  name="description"
                  rows={3}
                  className="mt-2 w-full rounded-md border border-[#D8D1C7] bg-white px-4 py-3 text-[#2C2A26] outline-none focus:border-[#8BA888]"
                />
              </label>

              <label className="block">
                <span className="text-sm text-[#6E6A64]">
                  История персонажа
                </span>

                <textarea
                  name="body"
                  rows={5}
                  className="mt-2 w-full rounded-md border border-[#D8D1C7] bg-white px-4 py-3 text-[#2C2A26] outline-none focus:border-[#8BA888]"
                />
              </label>

              {message && submitState === "saving" ? (
                <p className="rounded-md bg-[#EEF3ED] px-4 py-3 text-sm leading-6 text-[#3F5942]">
                  {message}
                </p>
              ) : null}

              {message && submitState === "error" ? (
                <p className="rounded-md bg-[#F8EAEA] px-4 py-3 text-sm leading-6 text-[#7A3A3A]">
                  {message}
                </p>
              ) : null}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full px-5 py-2 text-sm text-[#6E6A64] hover:bg-white"
                >
                  ✕ Отмена
                </button>

                <button
                  type="submit"
                  disabled={submitState === "saving"}
                  className="rounded-full bg-[#8BA888] px-5 py-2 text-sm text-white disabled:opacity-60"
                >
                  ✔{" "}
                  {submitState === "saving"
                    ? "Сохраняю"
                    : "Опубликовать"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}