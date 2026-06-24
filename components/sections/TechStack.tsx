"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";

const groupKeys = ["frontend", "backend", "databases", "ai", "devops"] as const;

export function TechStack() {
  const t = useTranslations("techStack");
  const reduce = useReducedMotion();

  return (
    <section id="stack" className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal direction="up" className="mb-12">
          <span className="section-label mb-4 block">{t("label")}</span>
          <h2 className="text-[2.2rem] font-medium max-md:tracking-tight md:tracking-normal text-text-primary">
            {t("headline")}
            <br />
            <span className="text-gradient">{t("headlineAccent")}</span>
          </h2>
        </Reveal>

        <div className="space-y-8">
          {groupKeys.map((group, i) => {
            const items = t.raw(`groups.${group}.items`) as string[];

            return (
              <Reveal key={group} direction="up" delay={i * 0.1}>
                <div className="rounded-xl border border-border-subtle bg-bg-secondary p-6">
                  <h3 className="section-label mb-4">{t(`groups.${group}.label`)}</h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <motion.span
                        key={item}
                        whileHover={
                          reduce
                            ? undefined
                            : { scale: 1.05, borderColor: "var(--accent-glow)", color: "var(--text-primary)" }
                        }
                        whileTap={reduce ? undefined : { scale: 0.96 }}
                        className="tag-pill will-change-transform"
                      >
                        {item}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
