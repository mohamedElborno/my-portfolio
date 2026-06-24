"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { staggerContainer, staggerItem, slideInRight } from "@/lib/animations";
import Link from "next/link";

// ─── Static project data ───────────────────────────────────────────────────────

const studyKeys = ["erp", "repvix"] as const;
type StudyKey = (typeof studyKeys)[number];

const stackByStudy: Record<StudyKey, string[]> = {
  erp: ["Next.js", "TypeScript", "MongoDB", "Node.js"],
  repvix: [
    "Next.js",
    "Convex",
    "TypeScript",
    "GPT-5 Mini",
    "Lemon Squeezy",
    "Clerk",
  ],
};

const metricsByStudy: Record<StudyKey, { value: string; labelKey: string }[]> =
  {
    erp: [
      { value: "1,200+", labelKey: "entities" },
      { value: "3+", labelKey: "modules" },
      { value: "12mo", labelKey: "active" },
    ],
    repvix: [
      { value: "6wk", labelKey: "timeline" },
      { value: "7", labelKey: "languages" },
      { value: "3", labelKey: "integrations" },
    ],
  };

const urlByStudy: Record<StudyKey, string> = {
  erp: "internal.erp.sa/dashboard",
  repvix: "repvix.com/dashboard",
};

/**
 * Add real screenshot paths here to populate the gallery rows.
 * Each project supports up to 3 thumbnails.
 * Example: erp: ["/screenshots/erp-invoices.png", "/screenshots/erp-warehouse.png"]
 */
const screenshotsByStudy: Record<StudyKey, string[]> = {
  erp: [],
  repvix: [],
};

// ─── Dashboard mockups ─────────────────────────────────────────────────────────

const CHART_BARS = [28, 44, 36, 58, 42, 70, 52, 76, 60, 84, 68, 96];

function ErpMockup() {
  return (
    <div
      dir="ltr"
      aria-hidden="true"
      className="h-full w-full overflow-hidden bg-[#0b0e18] text-[8px] leading-none select-none"
    >
      <div className="flex h-7 items-center justify-between border-b border-white/6 bg-[#08090f] px-3">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded bg-[#818cf8]/40" />
          <div className="h-1.5 w-20 rounded bg-white/20" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-10 rounded bg-white/10" />
          <div className="h-4 w-4 rounded-full bg-white/10" />
        </div>
      </div>
      <div className="flex h-[calc(100%-1.75rem)]">
        <div className="flex w-8 flex-col items-center gap-1.5 border-r border-white/5 py-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-4 w-4 rounded"
              style={{
                background:
                  i === 2 ? "rgba(129,140,248,0.3)" : "rgba(255,255,255,0.04)",
              }}
            />
          ))}
        </div>
        <div className="flex-1 space-y-2 overflow-hidden p-2.5">
          <div className="grid grid-cols-3 gap-1.5">
            {[true, false, false].map((accent, i) => (
              <div
                key={i}
                className="rounded-md border border-white/[0.07] bg-white/2 p-2"
              >
                <div className="mb-1 h-1.5 w-10 rounded bg-white/15" />
                <div className="mb-1 h-2.5 w-12 rounded bg-white/35" />
                <div
                  className="h-1 w-6 rounded"
                  style={{
                    background: accent
                      ? "rgba(129,140,248,0.6)"
                      : "rgba(255,255,255,0.1)",
                  }}
                />
              </div>
            ))}
          </div>
          <div className="rounded-md border border-white/[0.07] bg-white/2 p-2">
            <div className="mb-2 flex items-center justify-between">
              <div className="h-1.5 w-16 rounded bg-white/20" />
              <div className="h-1.5 w-8 rounded bg-white/10" />
            </div>
            <div className="flex h-12 items-end gap-px">
              {CHART_BARS.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm"
                  style={{
                    height: `${h}%`,
                    background:
                      i === CHART_BARS.length - 1
                        ? "rgba(129,140,248,0.9)"
                        : i >= CHART_BARS.length - 3
                          ? "rgba(129,140,248,0.28)"
                          : "rgba(255,255,255,0.07)",
                  }}
                />
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-md border border-white/[0.07]">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center gap-2 border-b border-white/4 px-2 py-1.5 last:border-0"
              >
                <div className="h-1.5 w-10 rounded bg-white/20" />
                <div className="h-1.5 flex-1 rounded bg-white/10" />
                <div
                  className="h-1.5 w-8 shrink-0 rounded"
                  style={{
                    background:
                      i === 0
                        ? "rgba(129,140,248,0.55)"
                        : i === 1
                          ? "rgba(251,191,36,0.35)"
                          : "rgba(255,255,255,0.12)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RepvixMockup() {
  const scores = [92, 78, 45, 88, 61];
  return (
    <div
      dir="ltr"
      aria-hidden="true"
      className="h-full w-full overflow-hidden bg-[#0b0e18] text-[8px] leading-none select-none"
    >
      <div className="flex h-7 items-center justify-between border-b border-white/6 bg-[#08090f] px-3">
        <div className="flex items-center gap-2.5">
          <div
            className="h-3 w-12 rounded"
            style={{ background: "rgba(129,140,248,0.35)" }}
          />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-1.5 w-8 rounded bg-white/10" />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="h-4 w-12 rounded"
            style={{ background: "rgba(129,140,248,0.2)" }}
          />
          <div className="h-4 w-4 rounded-full bg-white/10" />
        </div>
      </div>
      <div className="flex h-[calc(100%-1.75rem)]">
        <div className="w-[42%] overflow-hidden border-r border-white/5">
          <div className="border-b border-white/5 px-2.5 py-2">
            <div className="h-1.5 w-16 rounded bg-white/20" />
          </div>
          {scores.map((score, i) => (
            <div
              key={i}
              className="flex items-center gap-2 border-b border-white/4 px-2 py-1.5 last:border-0"
            >
              <div className="h-4 w-4 shrink-0 rounded-full bg-white/10" />
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 h-1.5 w-14 rounded bg-white/25" />
                <div className="h-1 w-16 rounded bg-white/10" />
              </div>
              <span
                className="shrink-0 rounded px-1 py-0.5 text-[7px] font-semibold"
                style={{
                  background:
                    score >= 80
                      ? "rgba(52,211,153,0.2)"
                      : score >= 60
                        ? "rgba(251,191,36,0.2)"
                        : "rgba(248,113,113,0.2)",
                  color:
                    score >= 80
                      ? "#6ee7b7"
                      : score >= 60
                        ? "#fcd34d"
                        : "#fca5a5",
                }}
              >
                {score}
              </span>
            </div>
          ))}
        </div>
        <div className="flex-1 space-y-2.5 overflow-hidden p-2.5">
          <div className="h-1.5 w-16 rounded bg-white/20" />
          {[
            { pct: 67, color: "rgba(52,211,153,0.55)" },
            { pct: 23, color: "rgba(255,255,255,0.22)" },
            { pct: 10, color: "rgba(248,113,113,0.45)" },
          ].map((bar, i) => (
            <div key={i}>
              <div className="mb-0.5 flex justify-between">
                <div className="h-1.5 w-8 rounded bg-white/20" />
                <div className="h-1.5 w-5 rounded bg-white/15" />
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${bar.pct}%`, background: bar.color }}
                />
              </div>
            </div>
          ))}
          <div
            className="rounded-md border p-2"
            style={{
              borderColor: "rgba(129,140,248,0.2)",
              background: "rgba(129,140,248,0.06)",
            }}
          >
            <div className="mb-1 flex items-center gap-1">
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "rgba(129,140,248,0.8)" }}
              />
              <div className="h-1.5 w-12 rounded bg-white/25" />
            </div>
            <div className="space-y-1">
              <div className="h-1.5 w-full rounded bg-white/12" />
              <div className="h-1.5 w-4/5 rounded bg-white/10" />
              <div className="h-1.5 w-3/5 rounded bg-white/8" />
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {[3, 2, 2, 2, 3].map((w, i) => (
              <div key={i} className="rounded bg-white/5 px-1 py-0.5">
                <div
                  className="h-1 rounded bg-white/20"
                  style={{ width: `${w * 8}px` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screenshot placeholder ────────────────────────────────────────────────────

function ScreenshotSlot({ src, alt }: { src?: string; alt: string }) {
  if (src) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl border border-border-subtle">
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
    );
  }
  return (
    <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-border-subtle bg-bg-secondary transition-colors hover:border-border-default">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="text-text-tertiary opacity-40"
      >
        <rect
          x="3"
          y="6"
          width="18"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8 6V5a1 1 0 011-1h6a1 1 0 011 1v1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

// ─── Single project block ──────────────────────────────────────────────────────

function ProjectBlock({
  studyKey,
  index,
}: {
  studyKey: StudyKey;
  index: number;
}) {
  const t = useTranslations("caseStudies");
  const reduce = useReducedMotion();
  const sections = ["problem", "decision", "result"] as const;
  const hasChallenge = t.has(`items.${studyKey}.challenge`);
  const screenshots = screenshotsByStudy[studyKey];

  const metricContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const stackContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
  };

  return (
    <Reveal direction="up" delay={index * 0.05}>
      <article>
        {/* ── project header strip ─────────────────────────── */}
        <div className="mb-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border-subtle pb-6">
          <span className="font-mono text-[11px] font-semibold tracking-widest text-accent">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="text-[1.15rem] font-semibold tracking-tight text-text-primary">
            {t(`items.${studyKey}.title`)}
          </h3>
          <span className="hidden h-3.5 w-px bg-border-default sm:block" />
          <span className="text-[12px] text-text-tertiary">
            {t(`items.${studyKey}.period`)}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <span className="tag-pill-accent text-[11px]">
              {t(`items.${studyKey}.tag`)}
            </span>
            <span className="inline-flex items-center gap-1.5  text-[11px] text-accent">
              <span className="glow-dot scale-75" />
              {studyKey === "erp" ? t("active") : t("live")}
            </span>
            {studyKey === "repvix" && (
              <Link
                href="https://repvix.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5  text-[11px] text-accent opacity-60 transition-opacity hover:opacity-100"
              >
                repvix.com
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* ── two-column layout ────────────────────────────── */}
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          {/* LEFT: image showcase (always LTR) */}
          <div dir="ltr" className="space-y-3">
            {/* main browser mockup */}
            <div className="overflow-hidden rounded-xl border border-border-subtle shadow-card">
              <div className="flex items-center gap-1.5 border-b border-border-subtle bg-bg-tertiary px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
                <div className="mx-3 max-w-[200px] flex-1 overflow-hidden rounded-md bg-bg-elevated px-3 py-1 text-center  text-[11px] text-text-tertiary">
                  <span className="truncate">{urlByStudy[studyKey]}</span>
                </div>
              </div>
              <div className="h-64 sm:h-68">
                {studyKey === "erp" ? <ErpMockup /> : <RepvixMockup />}
              </div>
            </div>

            {/* screenshot thumbnail row (3 slots) */}
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <ScreenshotSlot
                  key={i}
                  src={screenshots[i]}
                  alt={`${t(`items.${studyKey}.title`)} — screenshot ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: project narrative */}
          <div className="flex flex-col justify-between">
            {/* sections */}
            <div className="space-y-5">
              {sections.map((section) => (
                <div key={section}>
                  <span className="section-label mb-1.5 block">
                    {t(`sections.${section}`)}
                  </span>
                  <p className="text-[13.5px] leading-relaxed text-text-secondary">
                    {t(`items.${studyKey}.${section}`)}
                  </p>
                </div>
              ))}
              {hasChallenge && (
                <div>
                  <span className="section-label mb-1.5 block">
                    {t("sections.challenge")}
                  </span>
                  <p className="text-[13.5px] leading-relaxed text-text-secondary">
                    {t(`items.${studyKey}.challenge`)}
                  </p>
                </div>
              )}
            </div>

            {/* metrics + stack */}
            <div className="mt-7 space-y-3 border-t border-border-subtle pt-5">
              <motion.div
                className="flex flex-wrap gap-2"
                variants={reduce ? undefined : metricContainer}
                initial={reduce ? undefined : "hidden"}
                animate={reduce ? undefined : "visible"}
              >
                {metricsByStudy[studyKey].map((m) => (
                  <motion.div
                    key={m.labelKey}
                    variants={reduce ? undefined : staggerItem}
                    className="stat-pill"
                  >
                    <span className="font-semibold text-text-primary">
                      {m.value}
                    </span>
                    <span className="text-[11px] text-text-tertiary">
                      {t(`metricLabels.${m.labelKey}`)}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="flex flex-wrap gap-1.5"
                variants={reduce ? undefined : stackContainer}
                initial={reduce ? undefined : "hidden"}
                animate={reduce ? undefined : "visible"}
              >
                {stackByStudy[studyKey].map((tech) => (
                  <motion.span
                    key={tech}
                    variants={reduce ? undefined : slideInRight}
                    className="tag-pill"
                  >
                    {tech}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

// ─── Other projects compact grid ──────────────────────────────────────────────

const otherProjectKeys = ["isworb", "danerdz", "grandfather"] as const;
type OtherKey = (typeof otherProjectKeys)[number];

const otherProjectMeta: Record<
  OtherKey,
  { url: string; status: "completed" | "cancelled" }
> = {
  isworb: { url: "https://isworb.com/en", status: "completed" },
  danerdz: { url: "https://danerdz.vercel.app", status: "cancelled" },
  grandfather: {
    url: "https://mohammed-sedky-elborno.vercel.app",
    status: "completed",
  },
};

function OtherProjectsGrid({ startIndex }: { startIndex: number }) {
  const t = useTranslations("caseStudies");

  return (
    <Reveal direction="up" delay={0.05}>
      <div>
        <div className="mb-8 flex items-center gap-4">
          <span className=" text-[11px] font-semibold tracking-widest text-text-tertiary uppercase">
            {t("otherProjects.label")}
          </span>
          <div className="h-px flex-1 bg-border-subtle" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {otherProjectKeys.map((key: OtherKey, i) => {
            const { url, status } = otherProjectMeta[key];
            const isCancelled = status === "cancelled";

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.07,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                className="group relative flex flex-col gap-3 rounded-xl border border-border-subtle bg-bg-secondary p-5 transition-colors duration-200 hover:border-border-default hover:bg-bg-elevated"
              >
                {/* top row: number + status + link */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-semibold tracking-widest text-accent">
                    {String(startIndex + i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-2">
                    {/* status badge */}
                    <span
                      className={[
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                        isCancelled
                          ? "bg-text-tertiary/10 text-text-tertiary"
                          : "bg-accent/10 text-accent",
                      ].join(" ")}
                    >
                      {!isCancelled && (
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      )}
                      {isCancelled
                        ? t("otherProjects.statusCancelled")
                        : t("otherProjects.statusCompleted")}
                    </span>

                    {/* external link */}
                    <Link
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(`otherProjects.${key}.title`)}
                      className="text-text-tertiary opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:text-text-primary"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* title */}
                <h4
                  className={[
                    "text-[14px] font-semibold leading-snug tracking-tight",
                    isCancelled ? "text-text-tertiary" : "text-text-primary",
                  ].join(" ")}
                >
                  {t(`otherProjects.${key}.title`)}
                </h4>

                {/* description */}
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  {t(`otherProjects.${key}.description`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────────

export function CaseStudies() {
  const t = useTranslations("caseStudies");

  return (
    <section id="work" className="relative px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="section-label mb-4 block">{t("label")}</span>
          <h2 className="text-[2.2rem] font-medium tracking-tight text-primary">
            {t("headline")}
            <br />
            <span className="text-gradient">{t("headlineAccent")}</span>
          </h2>
        </Reveal>

        <div className="mt-20 space-y-28">
          {studyKeys.map((key, i) => (
            <ProjectBlock key={key} studyKey={key} index={i} />
          ))}
        </div>

        <div className="mt-24 pt-6">
          <OtherProjectsGrid startIndex={studyKeys.length} />
        </div>
      </div>
    </section>
  );
}
