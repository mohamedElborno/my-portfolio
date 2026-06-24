"use client";

import { useTranslations, useLocale } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  const t = useTranslations("about");
  const nav = useTranslations("nav");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const paragraphs = [
    { num: "01", text: t("p1") },
    { num: "02", text: t("p2") },
    { num: "03", text: t("p3") },
  ] as const;

  return (
    <section
      id="about"
      className="relative overflow-hidden px-6 py-28 sm:py-36"
    >
      <div className="mx-auto max-w-6xl">
        {/* section label */}
        <Reveal direction="up">
          <span className="section-label">{t("label")}</span>
        </Reveal>

        {/* ── QUOTE ─────────────────────────────────────────── */}
        <Reveal direction="up" delay={0.1}>
          <div className="relative mt-12">
            {/* decorative large quote mark */}
            <span
              aria-hidden
              className="pointer-events-none absolute select-none leading-none text-accent/10"
              style={{
                fontSize: "clamp(6rem, 11vw, 9rem)",
                top: "-1.25rem",
                [isRtl ? "right" : "left"]: "-0.5rem",
              }}
            >
              &ldquo;
            </span>

            <blockquote className="relative max-w-4xl text-[clamp(1.65rem,3.4vw,2.35rem)] font-semibold leading-tight max-md:tracking-tight md:tracking-normal text-text-primary">
              {t("quote")}
            </blockquote>

            <footer className="mt-6 flex items-center gap-3">
              <div className="h-px w-10 shrink-0 bg-accent" />
              <p className="text-sm leading-snug">
                <span className="font-semibold text-text-primary">
                  {nav("name")}
                </span>
                <span className="mx-1.5 text-text-tertiary">·</span>
                <span className="text-text-tertiary">{t("role")}</span>
              </p>
            </footer>
          </div>
        </Reveal>

        {/* ── THREE NUMBERED PARAGRAPHS ─────────────────────── */}
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {paragraphs.map(({ num, text }, i) => (
            <Reveal key={num} direction="up" delay={i * 0.08}>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className=" text-[11px] font-semibold tracking-widest text-accent">
                    {num}
                  </span>
                  <div className="h-px flex-1 bg-border-subtle" />
                </div>
                <p className="text-[14.5px] leading-relaxed text-text-secondary">
                  {text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── BOTTOM FACTS STRIP ────────────────────────────── */}
        <Reveal direction="up" delay={0.28}>
          <div className="mt-14 flex flex-wrap items-center gap-3 border-t border-border-subtle pt-8">
            <span className="tag-pill-accent">
              <span className="glow-dot" />
              {t("available")}
            </span>
            <span className="tag-pill">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="text-text-tertiary"
              >
                <path
                  d="M12 21s7-5.686 7-11a7 7 0 10-14 0c0 5.314 7 11 7 11z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <circle
                  cx="12"
                  cy="10"
                  r="2.4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
              Erzurum, TR
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
