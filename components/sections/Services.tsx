"use client";

import { Fragment, useRef, type ReactNode } from "react";
import {
  motion,
  useAnimation,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";

const serviceKeys = [
  "erp",
  "financial",
  "ai",
  "saas",
  "analytics",
  "database",
] as const;
type ServiceKey = (typeof serviceKeys)[number];

/** Cards that span 2 columns in the bento grid and include a mini visual */
const largeCards = new Set<ServiceKey>(["erp", "saas", "database"]);

const ENTER_EASE = [0.21, 0.47, 0.32, 0.98] as const;
const CHART_H = [6, 9, 7, 11, 8, 13, 10, 12, 8, 14, 11, 15];

// ─── Mini visuals ──────────────────────────────────────────────────────────────

function ErpVisual() {
  const t = useTranslations("services.items.erp");
  const steps = [
    t("quotations"),
    t("receipts"),
    t("invoices"),
    t("deliveries"),
    t("journalEntries"),
  ];
  const locale = useLocale();
  return (
    <div
      className="flex min-w-0 max-w-full items-center gap-1.5 overflow-x-auto pb-0.5 cursor-default overscroll-x-contain"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {steps.map((step, i) => (
        <Fragment key={step}>
          <div className="shrink-0 rounded-md border border-accent/25 bg-accent/10 px-2.5 py-1 text-[10px] font-medium text-accent">
            {step}
          </div>
          {i < steps.length - 1 && (
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              aria-hidden
              className={`shrink-0 text-border-emphasis ${locale === "ar" ? "rotate-180" : ""}`}
            >
              <path
                d="M1 4h10M7 1l4 3-4 3"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </Fragment>
      ))}
    </div>
  );
}

function SaasVisual() {
  const metrics = [
    { label: "ARR", pct: 85 },
    { label: "DAU", pct: 73 },
    { label: "Uptime", pct: 99 },
  ];
  return (
    <div className="space-y-2.5">
      {metrics.map((m) => (
        <div key={m.label} className="flex items-center gap-3">
          <span className="w-10 shrink-0  text-[10px] text-text-tertiary">
            {m.label}
          </span>
          <div
            className="flex-1 overflow-hidden rounded-full bg-border-subtle"
            style={{ height: "5px" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${m.pct}%`,
                background: "var(--accent-gradient)",
              }}
            />
          </div>
          <span className="w-7 text-right  text-[10px] text-text-tertiary">
            {m.pct}%
          </span>
        </div>
      ))}
    </div>
  );
}

function DatabaseVisual() {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className=" text-[10px] text-text-tertiary">
          concurrent_writes/s
        </span>
        <span className="flex items-center gap-1  text-[10px] text-accent">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-accent"
            style={{ animation: "pulseAccent 2s ease-in-out infinite" }}
          />
          live
        </span>
      </div>
      <div className="flex h-10 items-end gap-px">
        {CHART_H.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm will-change-transform"
            style={{
              height: `${(h / 15) * 100}%`,
              background:
                i === CHART_H.length - 1
                  ? "var(--accent)"
                  : i >= CHART_H.length - 3
                    ? "rgba(129,140,248,0.35)"
                    : "rgba(129,140,248,0.12)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Icon set ──────────────────────────────────────────────────────────────────

const icons: Record<ServiceKey, ReactNode> = {
  erp: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
  financial: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
  ai: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12" />
    </svg>
  ),
  saas: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  ),
  analytics: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  database: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
    </svg>
  ),
};

// ─── Section ───────────────────────────────────────────────────────────────────

export function Services() {
  const t = useTranslations("services");

  return (
    <section id="services" className="relative px-6 py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-[0.025] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* header */}
        <Reveal className="mb-14 flex items-end justify-between gap-8">
          <div>
            <span className="section-label mb-4 block">{t("label")}</span>
            <h2 className="text-[2.2rem] font-medium max-md:tracking-tight md:tracking-normal text-text-primary">
              {t("headline")}
              <br />
              <span className="text-gradient">{t("headlineAccent")}</span>
            </h2>
          </div>
          <span
            aria-hidden
            className="hidden shrink-0 font-mono text-[5rem] font-bold leading-none text-text-primary opacity-[0.05] md:block"
          >
            06
          </span>
        </Reveal>

        {/* bento grid — each card is the direct grid child for correct col-span */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceKeys.map((key, i) => (
            <ServiceCard
              key={key}
              index={i}
              serviceKey={key}
              icon={icons[key]}
              title={t(`items.${key}.title`)}
              description={t(`items.${key}.description`)}
              tags={t.raw(`items.${key}.tags`) as string[]}
              isLarge={largeCards.has(key)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Card ──────────────────────────────────────────────────────────────────────

function ServiceCard({
  index,
  serviceKey,
  icon,
  title,
  description,
  tags,
  isLarge,
}: {
  index: number;
  serviceKey: ServiceKey;
  icon: ReactNode;
  title: string;
  description: string;
  tags: string[];
  isLarge: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const reduce = useReducedMotion();
  const iconControls = useAnimation();
  const lineControls = useAnimation();
  const shineControls = useAnimation();

  const onHoverStart = () => {
    if (reduce) return;
    iconControls.start({ y: -2, color: "var(--accent)" });
    lineControls.start({
      scaleX: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    });
    shineControls.set({ x: "-100%" });
    shineControls.start({
      x: "200%",
      transition: { duration: 0.7, ease: "easeOut" },
    });
  };

  const onHoverEnd = () => {
    if (reduce) return;
    iconControls.start({ y: 0, color: "var(--text-secondary)" });
    lineControls.start({
      scaleX: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    });
  };

  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      ref={ref}
      className={[
        "card-base group relative flex h-full min-w-0 cursor-default flex-col overflow-hidden p-6 will-change-transform",
        isLarge ? "lg:col-span-2" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ ["--card-border" as string]: "var(--border-subtle)" }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }}
      animate={
        inView
          ? { opacity: 1, y: 0, scale: 1 }
          : reduce
            ? { opacity: 0 }
            : { opacity: 0, y: 20, scale: 0.97 }
      }
      transition={
        reduce
          ? { duration: 0.2 }
          : {
              duration: 0.55,
              delay: (index % 3) * 0.07,
              ease: ENTER_EASE,
            }
      }
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      whileHover={
        reduce
          ? undefined
          : { y: -4, ["--card-border" as string]: "var(--card-glow)" }
      }
      whileTap={reduce ? undefined : { scale: 0.98, y: -1 }}
    >
      {/* shine sweep */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 will-change-transform"
          initial={{ x: "-100%" }}
          animate={shineControls}
          style={{
            background:
              "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)",
          }}
        />
      )}

      {/* top row: icon + number */}
      <div className="relative z-10 mb-5 flex items-start justify-between">
        <motion.div
          animate={iconControls}
          initial={{ y: 0, color: "var(--text-secondary)" }}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle bg-bg-tertiary will-change-transform"
        >
          {icon}
        </motion.div>
        <span className="font-mono text-[11px] font-medium text-text-tertiary opacity-40 transition-opacity group-hover:opacity-70">
          {num}
        </span>
      </div>

      {/* title */}
      <h3 className="relative z-10 mb-2 text-[15px] font-semibold leading-snug text-text-primary">
        {title}
      </h3>

      {/* description */}
      <p
        className={[
          "relative z-10 text-[13px] leading-relaxed text-text-secondary",
          isLarge ? "mb-5" : "mb-5 flex-1",
        ].join(" ")}
      >
        {description}
      </p>

      {/* mini visual — large cards only */}
      {isLarge && (
        <div className="relative z-10 mb-5 min-w-0 flex-1 border-t border-border-subtle pt-4">
          {serviceKey === "erp" && <ErpVisual />}
          {serviceKey === "saas" && <SaasVisual />}
          {serviceKey === "database" && <DatabaseVisual />}
        </div>
      )}

      {/* tags */}
      <div className="relative z-10 flex flex-wrap gap-1.5 border-t border-border-subtle pt-4">
        {tags.map((tag) => (
          <span key={tag} className="tag-pill text-[11px]">
            {tag}
          </span>
        ))}
      </div>

      {/* hover accent line */}
      <motion.div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 z-10 h-px origin-center bg-linear-to-r from-transparent via-accent to-transparent"
        initial={{ scaleX: 0 }}
        animate={lineControls}
      />
    </motion.div>
  );
}
