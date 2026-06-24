"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";

const navLinks = [
  { href: "#about", key: "about" as const },
  { href: "#services", key: "services" as const },
  { href: "#work", key: "work" as const },
  { href: "#stack", key: "stack" as const },
  { href: "#contact", key: "contact" as const },
];

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const contact = useTranslations("contact");

  return (
    <footer className="relative z-10 mt-12 w-full min-w-0 border-t border-border-subtle bg-bg-primary sm:mt-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between md:py-10">
        <p className="text-[13px] leading-relaxed text-text-tertiary">{t("tagline")}</p>

        <nav className="flex flex-wrap gap-6" aria-label="Footer">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="text-[13px] text-text-secondary transition-colors hover:text-accent"
            >
              {nav(link.key)}
            </a>
          ))}
        </nav>

        <div className="flex flex-wrap gap-4">
          <a
            href="https://github.com/mohamedElborno"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[13px] text-text-secondary transition-colors hover:text-accent"
          >
            GitHub <ArrowUpRight size={12} />
          </a>
          <a
            href="https://www.linkedin.com/in/mohamed-elborno-8a2524252"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[13px] text-text-secondary transition-colors hover:text-accent"
          >
            LinkedIn <ArrowUpRight size={12} />
          </a>
          <a
            href={`mailto:${contact("email")}`}
            className="inline-flex items-center gap-1 text-[13px] text-text-secondary transition-colors hover:text-accent"
          >
            {t("email")} <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
      <div className="border-t border-border-subtle px-6 py-4 text-center">
        <p className=" text-[13px] text-text-tertiary">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
