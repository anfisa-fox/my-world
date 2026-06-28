"use client";

import { useAuthorMode } from "@/components/author-mode/AuthorModeProvider";

export function AuthorModeMark() {
  const { isAuthorMode, deactivateAuthorMode } = useAuthorMode();

  if (!isAuthorMode) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={deactivateAuthorMode}
      aria-label="Покинуть мир автора"
      className="border-0 bg-transparent p-0 font-serif text-[16px] italic leading-none text-[#7FA67D] outline-none transition-opacity hover:opacity-70 focus-visible:opacity-70"
    >
      ✦
    </button>
  );
}