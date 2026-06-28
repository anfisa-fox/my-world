"use client";

import Link from "next/link";

import { useAuthorMode } from "@/components/author-mode/AuthorModeProvider";

export function AuthorWallCreateCard() {
  const { isAuthorMode } = useAuthorMode();

  if (!isAuthorMode) {
    return null;
  }

  return (
    <Link href="/studio" className="group block">
      <article className="rounded-[6px] border border-dashed border-[#d9d2c8] bg-[#fafaf8] px-5 py-5 transition-colors hover:border-[#7FA67D]">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[#A8A197]">
              новая история
            </p>

            <h2 className="font-serif text-3xl font-light text-[#2C2A26] transition-colors group-hover:text-[#6B8A6B]">
              Что сегодня появится в этом мире?
            </h2>

            <p className="mt-4 text-base leading-7 text-[#5F5A52]">
              Здесь можно спокойно добавить новую мысль, заметку или историю.
            </p>
          </div>

          <span className="font-serif text-[28px] font-light leading-none text-[#7FA67D]">
            ＋
          </span>
        </div>
      </article>
    </Link>
  );
}