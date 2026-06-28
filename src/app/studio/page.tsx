"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { useAuthorMode } from "@/components/author-mode/AuthorModeProvider";

export default function StudioPage() {
  const { isAuthorMode, studioSecret } = useAuthorMode();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState("");

  function getCurrentStudioSecret() {
    return studioSecret || sessionStorage.getItem("studio-secret") || "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPublishing) {
      return;
    }

    if (!title.trim()) {
      setMessage("Как назовём эту историю?");
      return;
    }

    const currentStudioSecret = getCurrentStudioSecret();

    if (!currentStudioSecret) {
      setMessage("Сначала нужно вернуться в мир автора через ✦.");
      return;
    }

    setIsPublishing(true);
    setMessage("Секундочку, я сохраняю новую историю.");
    setPublishedSlug("");

    try {
      const response = await fetch("/api/studio/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-studio-secret": currentStudioSecret,
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage("Кажется, у меня не получилось сохранить историю. Попробуем ещё раз?");
        return;
      }

      setTitle("");
      setContent("");
      setPublishedSlug(data.slug);
      setMessage(
        "Готово! Я уже отправил новую историю на публикацию. Обычно это занимает пару минут."
      );
    } catch {
      setMessage("Кажется, что-то пошло не так. Попробуем ещё раз?");
    } finally {
      setIsPublishing(false);
    }
  }

  if (!isAuthorMode) {
    return (
      <main className="mx-auto max-w-3xl px-7 py-16">
        <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[#A8A197]">
          author mode
        </p>

        <h1 className="font-serif text-5xl font-light text-[#2C2A26]">
          Это место открывается после ✦
        </h1>

        <p className="mt-5 max-w-xl text-base leading-7 text-[#5F5A52]">
          Сначала вернись в мир автора через скрытый знак внизу главной
          страницы.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-[4px] border border-[#d9d2c8] bg-[#fafaf8] px-5 py-3 font-serif text-lg italic text-[#2C2A26] transition-colors hover:border-[#7FA67D] hover:text-[#6B8A6B]"
        >
          Вернуться в мир
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-7 py-16">
      <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[#A8A197]">
        новая история
      </p>

      <h1 className="font-serif text-5xl font-light text-[#2C2A26]">
        Что сегодня появится в этом мире?
      </h1>

      <p className="mt-5 max-w-xl text-base leading-7 text-[#5F5A52]">
        Здесь можно спокойно добавить новую мысль, заметку или историю на
        Стену.
      </p>

      <form onSubmit={handleSubmit} className="mt-10">
        <label className="block">
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#A8A197]">
            название
          </span>

          <input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setMessage("");
            }}
            placeholder="Как назовём эту историю?"
            className="mt-3 w-full rounded-[4px] border border-[#d9d2c8] bg-white px-4 py-3 font-serif text-2xl font-light text-[#2C2A26] outline-none transition-colors placeholder:text-[#B8B1A8] focus:border-[#7FA67D]"
          />
        </label>

        <label className="mt-7 block">
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#A8A197]">
            текст
          </span>

          <textarea
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              setMessage("");
            }}
            placeholder="Напиши здесь всё, что хочется сохранить."
            rows={10}
            className="mt-3 w-full resize-y rounded-[4px] border border-[#d9d2c8] bg-white px-4 py-3 text-base leading-7 text-[#5F5A52] outline-none transition-colors placeholder:text-[#B8B1A8] focus:border-[#7FA67D]"
          />
        </label>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={isPublishing}
            className="rounded-[4px] border border-[#d9d2c8] bg-[#fafaf8] px-6 py-3 font-serif text-lg italic text-[#2C2A26] outline-none transition-colors hover:border-[#7FA67D] hover:text-[#6B8A6B] focus-visible:border-[#7FA67D] focus-visible:text-[#6B8A6B] disabled:cursor-default disabled:opacity-60"
          >
            {isPublishing ? "Сохраняю..." : "Сохранить историю"}
          </button>

          <Link
            href="/wall"
            className="text-sm text-[#8A8780] transition-colors hover:text-[#2C2A26]"
          >
            вернуться на Стену
          </Link>
        </div>
      </form>

      {message && (
        <div className="mt-8 rounded-[6px] border border-[#e8e4de] bg-[#fafaf8] px-5 py-4 text-base leading-7 text-[#5F5A52]">
          <p>{message}</p>

          {publishedSlug && (
            <div className="mt-4 flex flex-wrap gap-4">
              <Link
                href={`/wall/${publishedSlug}`}
                className="text-sm text-[#6B8A6B] transition-colors hover:text-[#2C2A26]"
              >
                открыть историю →
              </Link>

              <Link
                href="/wall"
                className="text-sm text-[#6B8A6B] transition-colors hover:text-[#2C2A26]"
              >
                вернуться на Стену →
              </Link>
            </div>
          )}
        </div>
      )}
    </main>
  );
}