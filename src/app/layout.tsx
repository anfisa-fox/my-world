import type { Metadata } from "next";
import Link from "next/link";
import {
  Cormorant_Garamond,
  DM_Mono,
  DM_Sans,
} from "next/font/google";
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
  title: "Personal Creative World",
  description: "A personal creative world of drawings, characters and stories.",
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
        <header className="border-b border-[#e8e4de] bg-[#fafaf8]">
          <nav className="mx-auto flex max-w-4xl items-center justify-between px-7 py-4">
            <Link
              href="/"
              className="font-serif text-[18px] font-light tracking-[0.03em] text-[#2c2a26]"
            >
              мой мир ✦
            </Link>

            <div className="flex gap-6 text-[12px] tracking-[0.05em] text-[#8a8780]">
              <Link href="/gallery" className="hover:text-[#2c2a26]">
                галерея
              </Link>
              <Link href="/characters" className="hover:text-[#2c2a26]">
                персонажи
              </Link>
              <Link href="/wall" className="hover:text-[#2c2a26]">
                стена
              </Link>
            </div>
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}