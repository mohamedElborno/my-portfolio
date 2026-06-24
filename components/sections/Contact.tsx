"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { tapPress } from "@/lib/animations";

export function Contact() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const reduce = useReducedMotion();

  return (
    <section id="contact" className="relative px-6 py-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-accent opacity-[0.04] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <Reveal className="mb-12">
          <span className="section-label mb-4 block">{t("label")}</span>
          <h2 className="text-[2.2rem] font-medium tracking-tight text-text-primary">
            {t("heading")}
          </h2>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal direction={isRtl ? "right" : "left"}>
            <p className="text-[14px] leading-relaxed text-text-secondary">
              {t("paragraph")}
            </p>

            <div className="mt-8 space-y-4">
              <a
                href={`mailto:${t("email")}`}
                className="inline-flex items-center gap-2 text-text-primary transition-colors hover:text-accent"
              >
                <Mail size={18} aria-hidden />
                <span className="code-text">{t("email")}</span>
              </a>

              <div className="flex flex-wrap gap-4">
                <motion.a
                  href="https://github.com/mohamedElborno"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={reduce ? undefined : { y: -2 }}
                  whileTap={reduce ? undefined : tapPress}
                  className="btn-ghost px-3 py-2 text-[13px] will-change-transform"
                >
                  {t("github")} <ArrowUpRight size={14} />
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/mohamed-elborno-8a2524252"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={reduce ? undefined : { y: -2 }}
                  whileTap={reduce ? undefined : tapPress}
                  className="btn-ghost px-3 py-2 text-[13px] will-change-transform"
                >
                  {t("linkedin")} <ArrowUpRight size={14} />
                </motion.a>
              </div>

              <p className="inline-flex items-center gap-2 text-[13px] text-text-tertiary">
                <MapPin size={16} aria-hidden />
                {t("location")}
              </p>
            </div>
          </Reveal>

          <Reveal direction={isRtl ? "left" : "right"} delay={0.1}>
            <div className="card-base p-6 sm:p-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
