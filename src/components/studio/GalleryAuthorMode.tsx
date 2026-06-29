"use client";

import { FormEvent, useEffect, useState } from "react";

import { useAuthorMode } from "@/components/author-mode/AuthorModeProvider";

type SubmitState = "idle" | "saving" | "error";

type PendingArtwork = {
  title: string;
  createdAt: number;
};

const PENDING_ARTWORKS_STORAGE_KEY = "gallery-pending-artworks";
const PENDING_ARTWORK_TTL_MS = 10 * 60 * 1000;

function getFreshPendingArtworks(artworks: PendingArtwork[]) {
  const now = Date.now();

  return artworks.filter(
    (artwork) => now - artwork.createdAt < PENDING_ARTWORK_TTL_MS
  );
}

function readPendingArtworksFromSessionStorage(): PendingArtwork[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.sessionStorage.getItem(
      PENDING_ARTWORKS_STORAGE_KEY
    );

    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return getFreshPendingArtworks(
      parsedValue
        .filter((item) => {
          return (
            typeof item === "object" &&
            item !== null &&
            typeof item.title === "string" &&
            typeof item.createdAt === "number"
          );
        })
        .map((item) => ({
          title: item.title,
          createdAt: item.createdAt,
        }))
    );
  } catch {
    return [];
  }
}

function writePendingArtworksToSessionStorage(artworks: PendingArtwork[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    PENDING_ARTWORKS_STORAGE_KEY,
    JSON.stringify(artworks)
  );
}

export function GalleryAuthorMode() {
  const { isAuthorMode, studioSecret } = useAuthorMode();

  const [isOpen, setIsOpen] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [pendingArtworks, setPendingArtworks] = useState<PendingArtwork[]>([]);

  useEffect(() => {
    const freshPendingArtworks = readPendingArtworksFromSessionStorage();

    setPendingArtworks(freshPendingArtworks);
    writePendingArtworksToSessionStorage(freshPendingArtworks);
  }, []);

  if (!isAuthorMode) {
    return null;
  }

  function addPendingArtwork(title: string) {
    const pendingArtwork: PendingArtwork = {
      title,
      createdAt: Date.now(),
    };

    const freshPendingArtworks = getFreshPendingArtworks([
      pendingArtwork,
      ...pendingArtworks,
    ]);

    setPendingArtworks(freshPendingArtworks);
    writePendingArtworksToSessionStorage(freshPendingArtworks);
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
    const title = formData.get("title");

    setSubmitState("saving");
    setMessage("Секундочку, я сохраняю новую работу.");

    try {
      const response = await fetch("/api/studio/gallery", {
        method: "POST",
        headers: {
          "x-studio-secret": studioSecret,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Could not publish artwork.");
      }

      form.reset();
      addPendingArtwork(typeof title === "string" ? title : "Новая работа");
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
        className="min-h-[420px] w-full rounded-md border border-dashed border-[#D8D1C7] bg-white/60 px-6 py-10 text-left transition hover:-translate-y-1 hover:bg-white"
      >
        <div className="flex h-full flex-col items-center justify-center text-center">
          <span className="font-serif text-6xl font-light text-[#8BA888]">
            ＋
          </span>
          <span className="mt-4 font-serif text-2xl font-light text-[#2C2A26]">
            Добавить рисунок
          </span>
          <span className="mt-2 max-w-[220px] text-sm leading-6 text-[#6E6A64]">
            Что сегодня появится в галерее?
          </span>
        </div>
      </button>

      {pendingArtworks.map((pendingArtwork) => (
        <article
          key={`${pendingArtwork.createdAt}-${pendingArtwork.title}`}
          className="min-h-[420px] rounded-md border border-dashed border-[#D8D1C7] bg-white/70 px-6 py-10"
        >
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="font-serif text-5xl font-light text-[#8BA888]">
              ✦
            </span>

            <h2 className="mt-5 font-serif text-2xl font-light text-[#2C2A26]">
              {pendingArtwork.title}
            </h2>

            <p className="mt-3 max-w-[240px] text-sm leading-6 text-[#6E6A64]">
              Работа отправлена на публикацию. Она появится здесь через 1–2
              минуты.
            </p>
          </div>
        </article>
      ))}

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C2A26]/30 px-4 py-8 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-[#FAFAF8] p-6 shadow-xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-3xl font-light text-[#2C2A26]">
                  Добавить рисунок
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#6E6A64]">
                  Я помогу бережно добавить новую работу в галерею.
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
                  Как назовём рисунок?
                </span>
                <input
                  name="title"
                  required
                  className="mt-2 w-full rounded-md border border-[#D8D1C7] bg-white px-4 py-3 text-[#2C2A26] outline-none focus:border-[#8BA888]"
                />
              </label>

              <label className="block">
                <span className="text-sm text-[#6E6A64]">Выбрать рисунок</span>
                <input
                  name="image"
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                  required
                  className="mt-2 w-full rounded-md border border-[#D8D1C7] bg-white px-4 py-3 text-sm text-[#2C2A26] outline-none file:mr-4 file:rounded-full file:border-0 file:bg-[#EEF3ED] file:px-4 file:py-2 file:text-[#2C2A26]"
                />
              </label>

              <label className="block">
                <span className="text-sm text-[#6E6A64]">
                  Что хочется рассказать об этой работе?
                </span>
                <textarea
                  name="description"
                  rows={4}
                  className="mt-2 w-full rounded-md border border-[#D8D1C7] bg-white px-4 py-3 text-[#2C2A26] outline-none focus:border-[#8BA888]"
                />
              </label>

              <label className="block">
                <span className="text-sm text-[#6E6A64]">Теги</span>
                <input
                  name="tags"
                  placeholder="акварель, облака, мечта"
                  className="mt-2 w-full rounded-md border border-[#D8D1C7] bg-white px-4 py-3 text-[#2C2A26] outline-none focus:border-[#8BA888]"
                />
              </label>

              <label className="block">
                <span className="text-sm text-[#6E6A64]">Период</span>
                <input
                  name="period"
                  placeholder="2026"
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
                  ✔ {submitState === "saving" ? "Сохраняю" : "Опубликовать"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}