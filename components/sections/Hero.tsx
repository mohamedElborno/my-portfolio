"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { GridBackground } from "@/components/ui/GridBackground";
import { staggerContainer, staggerItem, tapPress } from "@/lib/animations";
import { cn } from "@/lib/utils";

const HERO_ICONS = [
  { name: "Next.js", src: "/icons/Next.js.svg" },
  { name: "TypeScript", src: "/icons/Typescript_logo_2020.svg" },
  { name: "MongoDB", src: "/icons/MongoDB.svg" },
  { name: "Convex", src: "/icons/convex.png" },
  { name: "Node.js", src: "/icons/Node.js.svg" },
];

const ENTER_EASE = [0.21, 0.47, 0.32, 0.98] as const;

const ERP_TAGS = ["Next.js", "MongoDB", "TypeScript", "Node.js"];
const REPVIX_TAGS = ["GPT-5 Mini", "Convex", "Next.js", "Clerk"];

/**
 * Language-agnostic headline split:
 * ~40 % of words on line 1 (neutral), the rest on line 2 (gradient accent).
 * Works regardless of locale or future headline edits.
 */
function splitHeadline(text: string): [string, string] {
  const words = text.trim().split(/\s+/);
  if (words.length <= 3) return [text, ""];
  const n = Math.max(2, Math.ceil(words.length * 0.4));
  if (n >= words.length) return [text, ""];
  return [words.slice(0, n).join(" "), words.slice(n).join(" ")];
}

export function Hero() {
  const t = useTranslations("hero");
  const nav = useTranslations("nav");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const reduce = useReducedMotion();
  const [headline1, headline2] = splitHeadline(t("headline"));

  const stats = [t("stats.uptime"), t("stats.shipped"), t("stats.languages")];

  const enter = (y: number, delay: number) =>
    reduce
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.2 },
        }
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: ENTER_EASE },
        };

  const statsContainer: Variants = reduce
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : staggerContainer;

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16 px-6"
    >
      <GridBackground />

      <div className="relative z-10 mx-auto grid w-full min-w-0 max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* ── Left: copy ─────────────────────────────────────── */}
        <div className="px-0">
          {/* availability badge */}
          <motion.div {...enter(8, 0.1)} className="mb-7 inline-flex px-0">
            <span className="tag-pill-accent">
              <span className="glow-dot" />
              {nav("title")}
            </span>
          </motion.div>

          {/* headline */}
          <h1
            className={cn(
              "mb-4 text-[clamp(2.4rem,5.4vw,3.9rem)] font-bold leading-[1.1] text-text-primary",
              "tracking-[-0.035em] md:tracking-normal",
            )}
          >
            <span className="block md:hidden">{headline1}</span>
            <motion.span {...enter(32, 0.2)} className="hidden md:block">
              {headline1}
            </motion.span>
            {headline2 && (
              <>
                <span className="block text-gradient md:hidden">
                  {headline2}
                </span>
                <motion.span
                  {...enter(32, 0.3)}
                  className="hidden md:block text-gradient"
                >
                  {headline2}
                </motion.span>
              </>
            )}
          </h1>

          {/* subheadline */}
          <p className="mb-9 px-0 max-w-lg text-[clamp(0.975rem,1.5vw,1.1rem)] leading-relaxed text-secondary md:hidden">
            {t("subheadline")}
          </p>
          <motion.p
            {...enter(20, 0.46)}
            className="mb-9 hidden max-w-lg text-[clamp(0.975rem,1.5vw,1.1rem)] leading-relaxed text-secondary md:block"
          >
            {t("subheadline")}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            {...enter(16, 0.58)}
            className="mb-10 flex flex-wrap items-center gap-3"
          >
            <motion.a
              href="#work"
              whileHover={reduce ? undefined : { y: -3 }}
              whileTap={reduce ? undefined : tapPress}
              className="btn-primary will-change-transform"
            >
              {t("ctaWork")}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
                className={cn(isRtl && "rtl-flip")}
              >
                <path
                  d="M3 7h8M7.5 3.5L11 7l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={reduce ? undefined : { y: -3 }}
              whileTap={reduce ? undefined : tapPress}
              className="btn-ghost will-change-transform"
            >
              {t("ctaContact")}
            </motion.a>
          </motion.div>

          {/* tech logo strip */}
          <motion.div
            {...(reduce
              ? {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  transition: { duration: 0.2 },
                }
              : {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  transition: { duration: 0.4, delay: 0.78 },
                })}
            className="flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            <span className="section-label">{t("builtWith")}</span>
            <div className="flex flex-wrap items-center gap-5">
              {HERO_ICONS.map(({ name, src }) => (
                <Image
                  key={name}
                  src={src}
                  alt={name}
                  width={22}
                  height={22}
                  className={`h-5 w-auto object-contain opacity-45 grayscale transition-all duration-300 hover:opacity-75 hover:grayscale-0 ${name === "Next.js" ? "dark:invert" : ""}`}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right: work snapshot ───────────────────────────── */}
        <motion.div
          dir="ltr"
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: 28, scale: 0.97 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }}
          transition={
            reduce
              ? { duration: 0.2 }
              : { duration: 0.7, delay: 0.52, ease: ENTER_EASE }
          }
          className="relative"
        >
          {/* ambient glow behind card */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 -z-10 rounded-4xl opacity-50 blur-3xl"
            style={{
              background:
                "radial-gradient(55% 55% at 50% 40%, var(--accent-dim), transparent 70%)",
            }}
          />

          <div className="card-base bg-transparent backdrop-blur-2xl overflow-hidden">
            {/* window chrome */}
            <div className="flex items-center justify-between border-b border-border-subtle bg-bg-tertiary px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
                <span className="ml-3  text-[11px] text-text-tertiary">
                  ~/work.log
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5  text-[11px] text-accent">
                <span className="glow-dot scale-75" />
                live
              </span>
            </div>

            {/* ── ERP project ── */}
            <ProjectRow
              name="ERP & POS Ecosystem"
              period="Apr 2025 – Present"
              statusLabel="Active"
              statusVariant="accent"
              tags={ERP_TAGS}
              metricKey="entities"
              metricValue="1,200+"
              metricNote="active in DB"
              reduce={!!reduce}
            />

            <div className="h-px bg-border-subtle" />

            {/* ── Repvix project ── */}
            <ProjectRow
              name="Repvix"
              nameHref="https://repvix.com"
              period="Oct – Nov 2025"
              statusLabel="Live"
              statusVariant="default"
              tags={REPVIX_TAGS}
              metricKey="shipped in"
              metricValue="6 weeks"
              metricNote="· 7 languages"
              reduce={!!reduce}
            />

            {/* ── translated stats strip ── */}
            <motion.div
              variants={statsContainer}
              initial="hidden"
              animate="visible"
              transition={reduce ? undefined : { delayChildren: 1.05 }}
              className="flex flex-wrap gap-2 border-t border-border-subtle bg-bg-tertiary px-5 py-4"
            >
              {stats.map((stat) => (
                <motion.span
                  key={stat}
                  variants={reduce ? undefined : staggerItem}
                  className="stat-pill"
                >
                  {stat}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Sub-component: single project row ────────────────────────────────────────

function ProjectRow({
  name,
  nameHref,
  period,
  statusLabel,
  statusVariant,
  tags,
  metricKey,
  metricValue,
  metricNote,
  reduce,
}: {
  name: string;
  nameHref?: string;
  period: string;
  statusLabel: string;
  statusVariant: "accent" | "default";
  tags: string[];
  metricKey: string;
  metricValue: string;
  metricNote: string;
  reduce: boolean;
}) {
  return (
    <div className="space-y-3 p-5">
      {/* header row */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-semibold text-text-primary">
              {name}
            </p>
            {nameHref && (
              <a
                href={nameHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5  text-[11px] text-accent opacity-70 transition-opacity hover:opacity-100"
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
              </a>
            )}
          </div>
          <p className="mt-0.5  text-[11px] text-text-tertiary">{period}</p>
        </div>

        {statusVariant === "accent" ? (
          <span className="tag-pill-accent shrink-0 text-[11px]">
            <span className="glow-dot scale-75" />
            {statusLabel}
          </span>
        ) : (
          <span className="tag-pill shrink-0 text-[11px]">{statusLabel}</span>
        )}
      </div>

      {/* tech tags */}
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span key={tag} className="tag-pill text-[10px]">
            {tag}
          </span>
        ))}
      </div>

      {/* metric bar */}
      <div className="flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-tertiary px-3 py-2  text-[11px]">
        <span className="text-text-tertiary">{metricKey}</span>
        <span className="text-text-tertiary">·</span>
        <span className="font-semibold text-accent">{metricValue}</span>
        <span className="ml-auto text-text-tertiary">{metricNote}</span>
      </div>
    </div>
  );
}
