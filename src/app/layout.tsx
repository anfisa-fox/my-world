import type { Metadata } from "next";
import Link from "next/link";
import {
  Cormorant_Garamond,
  DM_Mono,
  DM_Sans,
} from "next/font/google";

import { AuthorModeMark } from "@/components/author-mode/AuthorModeMark";
import { AuthorModeProvider } from "@/components/author-mode/AuthorModeProvider";

import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Froxy | Personal Creative World",
  description:
    "A personal creative world of drawings, characters and stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${dmSans.variable} ${dmMono.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AuthorModeProvider>
          <header className="border-b border-[#e8e4de] bg-[#fafaf8]">
            <nav className="mx-auto flex max-w-4xl items-center justify-between px-7 py-3.5">
              <Link
                href="/"
                className="flex items-center gap-3 text-[#2c2a26] transition-opacity hover:opacity-90"
                aria-label="Froxy — Personal Creative World"
              >
                <span className="flex items-center gap-2">
                  <AuthorModeMark />

                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="shrink-0"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="17"
                      fill="#FAF7F2"
                      stroke="#D9D2C8"
                      strokeWidth="1"
                    />

                    <circle
                      cx="18"
                      cy="18"
                      r="8"
                      fill="#F1ECE5"
                    />

                    <text
                      x="18"
                      y="24"
                      textAnchor="middle"
                      fontFamily="Cormorant Garamond, serif"
                      fontSize="22"
                      fontWeight="400"
                      fontStyle="italic"
                      fill="#7FA67D"
                    >
                      F
                    </text>
                  </svg>
                </span>

                <span className="flex flex-col leading-none">
                  <span className="font-serif text-[27px] font-light tracking-[0.02em] text-[#2c2a26]">
                    <span className="italic text-[#7FA67D]">
                      F
                    </span>
                    roxy
                  </span>

                  <span className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.22em] text-[#A8A197]">
                    personal creative world
                  </span>
                </span>
              </Link>

              <div className="flex gap-6 text-[12px] tracking-[0.05em] text-[#8a8780]">
                <Link
                  href="/gallery"
                  className="transition-colors hover:text-[#2c2a26]"
                >
                  галерея
                </Link>

                <Link
                  href="/characters"
                  className="transition-colors hover:text-[#2c2a26]"
                >
                  персонажи
                </Link>

                <Link
                  href="/wall"
                  className="transition-colors hover:text-[#2c2a26]"
                >
                  стена
                </Link>
              </div>
            </nav>
          </header>

          {children}
        </AuthorModeProvider>
      </body>
    </html>
  );
}