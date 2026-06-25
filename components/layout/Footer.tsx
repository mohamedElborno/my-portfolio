"use client";

import { useRef } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { FooterCat } from "../ui/TransparentVideo";
import { catVideoPlacement } from "@/lib/catVideo";

const navLinks = [
  { href: "#about", key: "about" as const },
  { href: "#services", key: "services" as const },
  { href: "#work", key: "work" as const },
  { href: "#stack", key: "stack" as const },
  { href: "#contact", key: "contact" as const },
];

const socialLinks = [
  {
    href: "https://github.com/mohamedElborno",
    label: "GitHub",
    external: true,
  },
  {
    href: "https://www.linkedin.com/in/mohamed-elborno-8a2524252",
    label: "LinkedIn",
    external: true,
  },
] as const;

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const contact = useTranslations("contact");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const footerRef = useRef<HTMLElement>(null);

  return (
    <footer
      ref={footerRef}
      className="relative z-10 w-full min-w-0 overflow-visible border-t border-border-subtle bg-bg-primary"
    >
      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-14">
        <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-12 lg:gap-16">
          <div className="relative flex max-w-sm flex-col gap-3 overflow-visible sm:gap-4">
            <a
              href="#hero"
              className={`${isRtl ? "-mr-2 -mt-2 -translate-y-5 translate-x-6 inline-flex w-fit transition-opacity duration-200 hover:opacity-80 sm:-mt-4 sm:-mr-4" : "-ml-2 -mt-2 -translate-y-5 -translate-x-6 inline-flex w-fit transition-opacity duration-200 hover:opacity-80 sm:-mt-4 sm:-ml-4"}`}
              aria-label={nav("name")}
            >
              <Image
                src="/my-logo.svg"
                alt={nav("name")}
                width={144}
                height={144}
                className="h-28 w-28 sm:h-36 sm:w-36 invert dark:invert-0"
              />
            </a>
            <p className="max-w-xs text-[13px] leading-relaxed text-text-tertiary sm:text-sm -translate-y-12">
              {t("tagline")}
            </p>
          </div>
          <div
            className={`grid gap-10 grid-cols-2 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]`}
          >
            <nav className="flex flex-col gap-3" aria-label="Footer">
              {navLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  className="w-fit text-[13px] text-text-secondary transition-colors hover:text-accent sm:text-sm"
                >
                  {nav(link.key)}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-fit items-center gap-1 text-[13px] text-text-secondary transition-colors hover:text-accent sm:text-sm"
                >
                  {link.label}{" "}
                  <ArrowUpRight
                    size={12}
                    className={`transition-transform duration-200 ${isRtl ? "group-hover:-translate-y-0.5 group-hover:-translate-x-0.5 rotate-y-180" : "group-hover:-translate-y-0.5 group-hover:translate-x-0.5"}`}
                  />
                </a>
              ))}
              <a
                href={`mailto:${contact("email")}`}
                className="group inline-flex w-fit items-center gap-1 text-[13px] text-text-secondary transition-colors hover:text-accent sm:text-sm"
              >
                {t("email")}{" "}
                <ArrowUpRight
                  size={12}
                  className={`transition-transform duration-200 ${isRtl ? "group-hover:-translate-y-0.5 group-hover:-translate-x-0.5 rotate-y-180" : "group-hover:-translate-y-0.5 group-hover:translate-x-0.5"}`}
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border-subtle px-6 py-4">
        <p className="text-center text-[13px] text-text-tertiary">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>

      <FooterCat {...catVideoPlacement} watchRef={footerRef} />
    </footer>
  );
}
