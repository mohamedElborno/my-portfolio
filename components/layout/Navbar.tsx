"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { tapPress } from "@/lib/animations";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navLinks = [
  { href: "#about", id: "about", key: "about" as const },
  { href: "#services", id: "services", key: "services" as const },
  { href: "#work", id: "work", key: "work" as const },
  { href: "#stack", id: "stack", key: "stack" as const },
  { href: "#contact", id: "contact", key: "contact" as const },
];

const locales = ["en", "ar", "tr"] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const highlight = hovered ?? activeSection;
  const pillSpring = reduce
    ? { duration: 0 }
    : ({ type: "spring", stiffness: 400, damping: 32 } as const);

  return (
    <motion.header
      initial={reduce ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.5 }}
      className="fixed inset-x-0 top-0 z-50 px-4"
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between gap-3 transition-all duration-300 ease-out",
          scrolled
            ? "mt-3 max-w-4xl rounded-2xl border border-border-default bg-bg-secondary/70 px-3 py-2 shadow-elevated backdrop-blur-xl"
            : "mt-0 max-w-6xl border border-transparent px-2 py-4",
        )}
      >
        <a href="#hero" className="group flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl shadow-accent-sm transition-transform duration-200 group-hover:scale-105"
            style={{ background: "var(--accent-gradient)" }}
          >
            <Image src="/my-logo.svg" alt="Logo" width={36} height={36} />
          </div>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-[14px] font-semibold text-text-primary">
              {t("name")}
            </span>
            <span className="text-[11px] text-text-tertiary">{t("title")}</span>
          </span>
        </a>

        <nav
          className="relative hidden items-center gap-1 md:flex"
          aria-label="Main"
          onMouseLeave={() => setHovered(null)}
        >
          {navLinks.map((link) => {
            const isHot = highlight === link.id;
            const isActive = activeSection === link.id;
            return (
              <Link
                key={link.key}
                href={link.href}
                onMouseEnter={() => setHovered(link.id)}
                className={cn(
                  "relative rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors duration-150",
                  isActive
                    ? "text-accent"
                    : isHot
                      ? "text-text-primary"
                      : "text-text-secondary",
                )}
              >
                {isHot && (
                  <motion.span
                    layoutId="navHighlight"
                    aria-hidden
                    className="absolute inset-0 rounded-lg border border-border-subtle bg-bg-elevated"
                    transition={pillSpring}
                  />
                )}
                <span className="relative z-10">{t(link.key)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-0.5 rounded-lg border border-border-default bg-bg-tertiary p-0.5 sm:flex">
            {locales.map((loc) => (
              <Link
                key={loc}
                href={pathname}
                locale={loc}
                lang={loc}
                className={cn(
                  "rounded-md px-2.5 py-1  text-[11px] font-semibold uppercase transition-all duration-150",
                  locale === loc
                    ? "bg-bg-elevated text-text-primary shadow-card"
                    : "text-text-tertiary hover:text-text-primary",
                )}
              >
                {loc}
              </Link>
            ))}
          </div>

          <ThemeToggle />

          <motion.a
            href="#contact"
            whileHover={reduce ? undefined : { y: -2 }}
            whileTap={reduce ? undefined : tapPress}
            className="btn-primary hidden px-4 py-2 text-[13px] will-change-transform sm:inline-flex"
          >
            {t("contact")}
          </motion.a>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-default bg-bg-tertiary text-text-primary transition-colors hover:border-accent hover:text-accent md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? t("menuClose") : t("menuOpen")}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            className="fixed inset-0 top-0 z-40 flex flex-col bg-bg-primary/95 px-8 pt-28 backdrop-blur-xl md:hidden"
          >
            <motion.nav
              className="flex flex-col gap-2"
              aria-label="Mobile"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: reduce ? 0 : 0.06 } },
              }}
            >
              {navLinks.map((link) => (
                <motion.a
                  key={link.key}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  variants={{
                    hidden: reduce ? { opacity: 0 } : { opacity: 0, x: -16 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  className={cn(
                    "border-b border-border-subtle py-4 text-3xl font-semibold transition-colors",
                    activeSection === link.id
                      ? "text-accent"
                      : "text-text-primary",
                  )}
                >
                  {t(link.key)}
                </motion.a>
              ))}
            </motion.nav>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-2">
                {locales.map((loc) => (
                  <Link
                    key={loc}
                    href={pathname}
                    locale={loc}
                    lang={loc}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "rounded-lg border border-border-default bg-bg-tertiary px-4 py-2  text-sm font-semibold uppercase",
                      locale === loc && "border-accent text-accent",
                    )}
                  >
                    {loc}
                  </Link>
                ))}
              </div>
              <ThemeToggle />
            </div>

            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="btn-primary mt-6 justify-center py-3 text-base"
            >
              {t("contact")}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
