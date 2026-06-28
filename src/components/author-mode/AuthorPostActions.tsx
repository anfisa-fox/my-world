"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthorMode } from "@/components/author-mode/AuthorModeProvider";

type AuthorPostActionsProps = {
  slug: string;
  title: string;
  content: string;
};

export function AuthorPostActions({
  slug,
  title,
  content,
}: AuthorPostActionsProps) {
  const router = useRouter();
  const { isAuthorMode, studioSecret } = useAuthorMode();

  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const [draftContent, setDraftContent] = useState(content);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isAuthorMode) {
    return null;
  }

  function getCurrentStudioSecret() {
    return studioSecret || sessionStorage.getItem("studio-secret") || "";
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    if (!draftTitle.trim()) {
      setMessage("Как назовём эту историю?");
      return;
    }

    const currentStudioSecret = getCurrentStudioSecret();

    if (!currentStudioSecret) {
      setMessage("Сначала нужно вернуться в мир автора через ✦.");
      return;
    }

    setIsSaving(true);
    setMessage("Секундочку, я сохраняю изменения.");

    try {
      const response = await fetch("/api/studio/posts/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-studio-secret": currentStudioSecret,
        },
        body: JSON.stringify({
          slug,
          title: draftTitle,
          content: draftContent,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(
          "Кажется, у меня не получилось сохранить изменения. Попробуем ещё раз?"
        );
        return;
      }

      setMessage(
        "Готово! Я уже отправил изменения на публикацию. Обычно это занимает пару минут."
      );
      setIsEditing(false);
    } catch {
      setMessage("Кажется, что-то пошло не так. Попробуем ещё раз?");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (isDeleting) {
      return;
    }

    const currentStudioSecret = getCurrentStudioSecret();

    if (!currentStudioSecret) {
      setMessage("Сначала нужно вернуться в мир автора через ✦.");
      return;
    }

    setIsDeleting(true);
    setMessage("Секундочку, я убираю эту историю из мира.");

    try {
      const response = await fetch("/api/studio/posts/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-studio-secret": currentStudioSecret,
        },
        body: JSON.stringify({
          slug,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(
          "Кажется, у меня не получилось убрать эту историю. Попробуем ещё раз?"
        );
        return;
      }

      setMessage(
        "Готово! Я уже отправил изменение на публикацию. Обычно это занимает пару минут."
      );

      window.setTimeout(() => {
        router.push("/wall");
      }, 1200);
    } catch {
      setMessage("Кажется, что-то пошло не так. Попробуем ещё раз?");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div aria-label={`Действия автора для записи ${slug}`} className="mb-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setIsEditing(true);
            setIsConfirmingDelete(false);
            setMessage("");
          }}
          className="rounded-[4px] border border-[#d9d2c8] bg-[#fafaf8] px-3 py-2 font-serif text-lg italic text-[#2C2A26] outline-none transition-colors hover:border-[#7FA67D] hover:text-[#6B8A6B] focus-visible:border-[#7FA67D] focus-visible:text-[#6B8A6B]"
        >
          ✎
        </button>

        <button
          type="button"
          onClick={() => {
            setIsConfirmingDelete(true);
            setIsEditing(false);
            setMessage("");
          }}
          className="rounded-[4px] border border-[#d9d2c8] bg-[#fafaf8] px-3 py-2 font-serif text-lg italic text-[#2C2A26] outline-none transition-colors hover:border-[#7FA67D] hover:text-[#6B8A6B] focus-visible:border-[#7FA67D] focus-visible:text-[#6B8A6B]"
        >
          🗑️
        </button>
      </div>

      {isEditing && (
        <form
          onSubmit={handleSave}
          className="mt-6 rounded-[6px] border border-[#e8e4de] bg-[#fafaf8] px-5 py-5"
        >
          <p className="mb-5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#A8A197]">
            изменить историю
          </p>

          <label className="block">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#A8A197]">
              название
            </span>

            <input
              value={draftTitle}
              onChange={(event) => {
                setDraftTitle(event.target.value);
                setMessage("");
              }}
              className="mt-3 w-full rounded-[4px] border border-[#d9d2c8] bg-white px-4 py-3 font-serif text-2xl font-light text-[#2C2A26] outline-none transition-colors focus:border-[#7FA67D]"
            />
          </label>

          <label className="mt-7 block">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#A8A197]">
              текст
            </span>

            <textarea
              value={draftContent}
              onChange={(event) => {
                setDraftContent(event.target.value);
                setMessage("");
              }}
              rows={10}
              className="mt-3 w-full resize-y rounded-[4px] border border-[#d9d2c8] bg-white px-4 py-3 text-base leading-7 text-[#5F5A52] outline-none transition-colors focus:border-[#7FA67D]"
            />
          </label>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-[4px] border border-[#d9d2c8] bg-white px-5 py-3 font-serif text-lg italic text-[#2C2A26] outline-none transition-colors hover:border-[#7FA67D] hover:text-[#6B8A6B] focus-visible:border-[#7FA67D] focus-visible:text-[#6B8A6B] disabled:cursor-default disabled:opacity-60"
            >
              {isSaving ? "Сохраняю..." : "Сохранить изменения"}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setDraftTitle(title);
                setDraftContent(content);
                setMessage("");
              }}
              className="text-sm text-[#8A8780] transition-colors hover:text-[#2C2A26]"
            >
              отменить
            </button>
          </div>
        </form>
      )}

      {isConfirmingDelete && (
        <div className="mt-6 rounded-[6px] border border-[#e8e4de] bg-[#fafaf8] px-5 py-5">
          <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[#A8A197]">
            убрать историю
          </p>

          <p className="text-base leading-7 text-[#5F5A52]">
            Точно убрать эту историю из мира?
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-[4px] border border-[#d9d2c8] bg-white px-5 py-3 font-serif text-lg italic text-[#2C2A26] outline-none transition-colors hover:border-[#7FA67D] hover:text-[#6B8A6B] focus-visible:border-[#7FA67D] focus-visible:text-[#6B8A6B] disabled:cursor-default disabled:opacity-60"
            >
              {isDeleting ? "Убираю..." : "Да, убрать"}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsConfirmingDelete(false);
                setMessage("");
              }}
              className="text-sm text-[#8A8780] transition-colors hover:text-[#2C2A26]"
            >
              оставить
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className="mt-6 rounded-[6px] border border-[#e8e4de] bg-[#fafaf8] px-5 py-4 text-base leading-7 text-[#5F5A52]">
          {message}
        </div>
      )}
    </div>
  );
}