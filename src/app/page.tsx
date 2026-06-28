import Link from "next/link";

import { AuthorModeGate } from "@/components/author-mode/AuthorModeGate";
import { getAllArtworks } from "@/lib/artworks";
import { getAllCharacters } from "@/lib/characters";
import { formatDate } from "@/lib/formatDate";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const artworks = getAllArtworks();
  const characters = getAllCharacters();
  const posts = getAllPosts();

  const featuredArtwork =
    artworks.find((artwork) => artwork.featured) ?? artworks[0];

  const featuredCharacter =
    characters.find(
      (character) => character.slug === "luna-windfeather"
    ) ?? characters[0];

  const featuredPost = posts[0];

  return (
    <main className="min-h-screen">
      <section className="border-b border-border px-7 pb-7 pt-14">
        <div className="mx-auto flex max-w-4xl items-end justify-between gap-8">
          <div>
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
              личный творческий мир
            </p>

            <h1 className="font-serif text-[44px] font-light leading-[1.08] text-foreground">
              Загляни
              <br />в мой{" "}
              <em className="font-light italic text-sage">мир</em>
            </h1>
          </div>

          <p className="max-w-[190px] pb-1 text-right text-[12px] leading-[1.65] text-muted-strong">
            Здесь живут рисунки,
            <br />
            персонажи и мысли.
            <br />
            Всё растёт вместе с автором.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-7 pb-12">
        {featuredArtwork && (
          <section className="border-b border-border py-7">
            <p className="mb-5 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-light after:h-px after:flex-1 after:bg-surface after:content-['']">
              из галереи
            </p>

            <div className="grid overflow-hidden rounded-[4px] md:grid-cols-[2fr_1fr]">
              <Link
                href={`/gallery/${featuredArtwork.slug}`}
                className="relative block h-[280px] overflow-hidden bg-surface"
              >
                <img
                  src={featuredArtwork.image}
                  alt={featuredArtwork.title}
                  className="h-full w-full object-cover"
                />

                <span className="absolute right-2.5 top-2.5 h-[9px] w-[9px] rounded-full bg-peach shadow-[0_0_0_2px_#fafaf8]" />

                <span className="absolute inset-y-0 right-0 w-[80px] bg-gradient-to-r from-transparent to-[#fafaf8]/80" />
              </Link>

              <div className="flex flex-col justify-between bg-surface px-4 py-5">
                <div>
                  <h2 className="font-serif text-[24px] font-light leading-[1.25] text-foreground">
                    {featuredArtwork.title}
                  </h2>

                  <p className="mt-1.5 font-mono text-[9px] text-muted">
                    {featuredArtwork.period}
                  </p>

                  <p className="relative mt-4 max-h-[82px] overflow-hidden text-[13px] leading-[1.7] text-muted-strong after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[28px] after:bg-gradient-to-b after:from-transparent after:to-surface after:content-['']">
                    {featuredArtwork.description}
                  </p>
                </div>

                <Link
                  href="/gallery"
                  className="mt-8 text-[11px] tracking-[0.03em] text-sage"
                >
                  вся галерея →
                </Link>
              </div>
            </div>
          </section>
        )}

        {featuredCharacter && (
          <section className="border-b border-border py-7">
            <p className="mb-5 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-light after:h-px after:flex-1 after:bg-surface after:content-['']">
              персонаж
            </p>

            <div className="grid grid-cols-[auto_1fr] items-start gap-5">
              <Link
                href={`/characters/${featuredCharacter.slug}`}
                className="relative block h-[128px] w-[104px] shrink-0 overflow-hidden rounded-[4px] bg-surface"
              >
                <img
                  src={featuredCharacter.avatar}
                  alt={featuredCharacter.name}
                  className="h-full w-full object-cover"
                />

                <span className="absolute right-1.5 top-1.5 h-[7px] w-[7px] rounded-full bg-peach shadow-[0_0_0_1.5px_#fafaf8]" />
              </Link>

              <div>
                <h2 className="mb-2 font-serif text-[28px] font-light text-foreground">
                  {featuredCharacter.name}
                </h2>

                <p className="relative max-h-[72px] overflow-hidden text-[13px] leading-[1.7] text-muted-strong after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[30px] after:bg-gradient-to-b after:from-transparent after:to-background after:content-['']">
                  {featuredCharacter.description}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-[3px] bg-[#ebf2ea] px-2 py-0.5 font-mono text-[9px] text-sage">
                    персонаж мира
                  </span>

                  <Link
                    href="/characters"
                    className="ml-auto text-[11px] text-sage"
                  >
                    все персонажи →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {featuredPost && (
          <section className="py-7">
            <p className="mb-5 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-light after:h-px after:flex-1 after:bg-surface after:content-['']">
              со стены
            </p>

            <div className="border-l-[2.5px] border-sage px-4 py-3.5">
              <p className="mb-2 font-mono text-[9px] text-muted">
                {formatDate(featuredPost.createdAt)}
              </p>

              <h2 className="mb-2 font-serif text-[24px] font-light text-foreground">
                {featuredPost.title}
              </h2>

              <p className="relative max-h-[64px] overflow-hidden text-[13px] leading-[1.7] text-muted-strong after:absolute after:bottom-0 after:left-0 after:right-0 after:h-7 after:bg-gradient-to-b after:from-transparent after:to-background after:content-['']">
                {featuredPost.content}
              </p>

              <Link
                href={`/wall/${featuredPost.slug}`}
                className="mt-2.5 inline-block text-[11px] text-sage"
              >
                читать дальше →
              </Link>
            </div>
          </section>
        )}
      </section>

      <footer className="border-t border-border px-7 py-5 text-center font-serif text-[13px] italic text-muted-light">
        этот мир растёт вместе со своим автором <AuthorModeGate />
      </footer>
    </main>
  );
}