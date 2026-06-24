import Link from "next/link";

export default function Home() {
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

          <p className="max-w-[180px] pb-1 text-right text-[11px] leading-[1.65] text-muted-strong">
            Здесь живут рисунки,
            <br />
            персонажи и мысли.
            <br />
            Всё растёт вместе с автором.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-7 pb-12">
        <section className="border-b border-border py-7">
          <p className="mb-5 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-light after:h-px after:flex-1 after:bg-surface after:content-['']">
            из галереи
          </p>

          <div className="grid overflow-hidden rounded-[4px] md:grid-cols-[2fr_1fr]">
            <Link
              href="/gallery"
              className="relative flex h-[240px] items-center justify-center bg-[#dde5da]"
            >
              <span className="select-none font-serif text-[80px] italic text-sage/35">
                ☽
              </span>

              <span className="absolute right-2.5 top-2.5 h-[9px] w-[9px] rounded-full bg-peach shadow-[0_0_0_2px_#fafaf8]" />

              <span className="absolute bottom-0 right-0 top-0 w-[60px] bg-gradient-to-r from-transparent to-[#dde5da]" />
            </Link>

            <div className="flex flex-col justify-between bg-surface px-4 py-5">
              <div>
                <h2 className="font-serif text-[19px] font-light leading-[1.3] text-foreground">
                  Moon Girl
                </h2>

                <p className="mt-1.5 font-mono text-[9px] text-muted">
                  Dream Worlds · март 2025
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

        <section className="border-b border-border py-7">
          <p className="mb-5 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-light after:h-px after:flex-1 after:bg-surface after:content-['']">
            персонаж
          </p>

          <div className="grid grid-cols-[auto_1fr] items-start gap-5">
            <Link
              href="/characters"
              className="relative flex h-[110px] w-[88px] shrink-0 items-center justify-center rounded-[4px] bg-[#eae0d8]"
            >
              <span className="font-serif text-[42px] font-light italic text-[#b9a794]">
                А
              </span>

              <span className="absolute right-1.5 top-1.5 h-[7px] w-[7px] rounded-full bg-peach shadow-[0_0_0_1.5px_#fafaf8]" />
            </Link>

            <div>
              <h2 className="mb-2 font-serif text-[25px] font-light text-foreground">
                Алина
              </h2>

              <p className="relative max-h-[60px] overflow-hidden text-[13px] leading-[1.7] text-muted-strong after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[30px] after:bg-gradient-to-b after:from-transparent after:to-background after:content-['']">
                Лесная ведьмочка, которая умеет разговаривать с деревьями.
                Живёт в маленьком домике на краю туманного леса и собирает
                воспоминания в стеклянные шары...
              </p>

              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="rounded-[3px] bg-[#ebf2ea] px-2 py-0.5 font-mono text-[9px] text-sage">
                  фэнтези
                </span>

                <span className="rounded-[3px] bg-[#ebf2ea] px-2 py-0.5 font-mono text-[9px] text-sage">
                  оригинальный
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

        <section className="py-7">
          <p className="mb-5 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-light after:h-px after:flex-1 after:bg-surface after:content-['']">
            со стены
          </p>

          <div className="border-l-[2.5px] border-sage px-4 py-3.5">
            <p className="mb-2 font-mono text-[9px] text-muted">
              14 июня 2025
            </p>

            <h2 className="mb-2 font-serif text-[21px] font-light text-foreground">
              Хочу нарисовать море ночью
            </h2>

            <p className="relative max-h-[56px] overflow-hidden text-[13px] leading-[1.7] text-muted-strong after:absolute after:bottom-0 after:left-0 after:right-0 after:h-7 after:bg-gradient-to-b after:from-transparent after:to-background after:content-['']">
              Сегодня видела видео с биолюминесцентными волнами. Надо
              обязательно попробовать — синий плюс зелёный. Или не
              люминесцентный, а просто очень тёмный фон, и пусть свет будет
              только в волнах...
            </p>

            <Link
              href="/wall"
              className="mt-2.5 inline-block text-[11px] text-sage"
            >
              читать дальше →
            </Link>
          </div>
        </section>
      </section>

      <footer className="border-t border-border px-7 py-5 text-center font-serif text-[13px] italic text-muted-light">
        этот мир растёт вместе со своим автором ✦
      </footer>
    </main>
  );
}