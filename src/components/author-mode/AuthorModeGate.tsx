"use client";

import { useState } from "react";

import { useAuthorMode } from "@/components/author-mode/AuthorModeProvider";

export function AuthorModeGate() {
  const { activateAuthorMode } = useAuthorMode();

  const [isOpen, setIsOpen] = useState(false);
  const [secret, setSecret] = useState("");
  const [message, setMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isChecking) {
      return;
    }

    if (!secret.trim()) {
      setMessage("Кажется, я не услышал ответ. Попробуем ещё раз?");
      return;
    }

    setIsChecking(true);
    setMessage("Секундочку, я узнаю тебя.");

    try {
      const response = await fetch("/api/studio/auth", {
        method: "POST",
        headers: {
          "x-studio-secret": secret,
        },
      });

      if (!response.ok) {
        setMessage("Кажется, это не ты. Попробуем ещё раз?");
        setSecret("");
        return;
      }

      activateAuthorMode(secret);
      setMessage("Я узнал тебя.");

      window.setTimeout(() => {
        setIsOpen(false);
        setSecret("");
        setMessage("");
      }, 1200);
    } catch {
      setMessage("Кажется, что-то пошло не так. Попробуем ещё раз?");
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Author Mode"
        className="ml-1 cursor-default border-0 bg-transparent p-0 font-serif italic text-muted-light outline-none transition-colors hover:text-sage focus-visible:text-sage"
      >
        ✦
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 px-7 backdrop-blur-sm">
          <div className="w-full max-w-[320px] rounded-[6px] border border-border bg-[#fafaf8] px-5 py-5 shadow-[0_18px_60px_rgba(44,42,38,0.12)]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-light">
                  author mode
                </p>

                <h2 className="font-serif text-[26px] font-light text-foreground">
                  Это ты?
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setSecret("");
                  setMessage("");
                }}
                aria-label="Закрыть"
                className="text-[18px] leading-none text-muted-light outline-none transition-colors hover:text-foreground focus-visible:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="password"
                value={secret}
                onChange={(event) => {
                  setSecret(event.target.value);
                  setMessage("");
                }}
                autoFocus
                disabled={isChecking}
                className="w-full rounded-[4px] border border-border bg-white px-3 py-2.5 text-[13px] text-foreground outline-none transition-colors focus:border-sage disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={isChecking}
                className="mt-4 w-full rounded-[4px] border border-border bg-surface px-3 py-2.5 font-serif text-[15px] italic text-foreground outline-none transition-colors hover:border-sage hover:text-sage focus-visible:border-sage focus-visible:text-sage disabled:cursor-default disabled:opacity-60"
              >
                {isChecking ? "…" : "✔"}
              </button>
            </form>

            {message && (
              <p className="mt-4 text-center text-[13px] leading-[1.6] text-muted-strong">
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}