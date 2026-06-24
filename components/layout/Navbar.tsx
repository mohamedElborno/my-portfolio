"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Check, Globe, Menu, X } from "lucide-react";
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
type Locale = (typeof locales)[number];

function LocaleDropdown({
  onSelect,
  className,
  align,
  placement = "below",
}: {
  onSelect?: () => void;
  className?: string;
  align?: "start" | "end";
  placement?: "below" | "above";
}) {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const resolvedAlign = align ?? "end";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        whileHover={reduce ? undefined : { y: -2 }}
        whileTap={reduce ? undefined : tapPress}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("language")}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle text-text-secondary transition-colors hover:border-accent hover:text-accent will-change-transform",
          open && "border-accent text-accent",
        )}
      >
        <Globe size={18} aria-hidden />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={t("language")}
            initial={
              reduce
                ? false
                : {
                    opacity: 0,
                    y: placement === "below" ? -6 : 6,
                    scale: 0.98,
                  }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduce
                ? undefined
                : {
                    opacity: 0,
                    y: placement === "below" ? -6 : 6,
                    scale: 0.98,
                  }
            }
            transition={{
              duration: reduce ? 0 : 0.18,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className={cn(
              "absolute z-50 min-w-38 max-w-[calc(100vw-3rem)] overflow-hidden rounded-xl border border-border-default bg-bg-secondary p-1 shadow-elevated backdrop-blur-xl space-y-1",
              resolvedAlign === "start" ? "inset-s-0" : "inset-e-0",
              placement === "below"
                ? "top-[calc(100%+0.375rem)]"
                : "bottom-[calc(100%+0.375rem)]",
            )}
          >
            {locales.map((loc) => {
              const isActive = locale === loc;
              return (
                <li key={loc} role="option" aria-selected={isActive}>
                  <Link
                    href={pathname}
                    locale={loc}
                    lang={loc}
                    onClick={() => {
                      setOpen(false);
                      onSelect?.();
                    }}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors",
                      isActive
                        ? "bg-accent-dim font-medium text-accent"
                        : "text-secondary duration-200 hover:bg-accent-dim hover:text-primary",
                    )}
                  >
                    <span>{t(`locales.${loc}`)}</span>
                    {isActive && (
                      <Check size={14} aria-hidden className="shrink-0" />
                    )}
                  </Link>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [hovered, setHovered] = useState<string | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyOverscroll = body.style.overscrollBehavior;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";

    const blockBackgroundScroll = (event: TouchEvent) => {
      const menu = mobileMenuRef.current;
      if (menu && event.target instanceof Node && menu.contains(event.target)) {
        return;
      }
      event.preventDefault();
    };

    document.addEventListener("touchmove", blockBackgroundScroll, {
      passive: false,
    });

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.overscrollBehavior = prevBodyOverscroll;
      document.removeEventListener("touchmove", blockBackgroundScroll);
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
          "relative z-60 mx-auto flex items-center justify-between gap-3 transition-all duration-300 ease-out",
          scrolled
            ? "mt-3 max-w-4xl rounded-2xl border border-border-default bg-bg-secondary/70 px-3 py-2 shadow-elevated backdrop-blur-xl"
            : "mt-0 max-w-6xl border border-transparent px-2 py-4",
          menuOpen &&
            "max-md:mt-0 max-md:max-w-none max-md:justify-end max-md:border-transparent max-md:bg-transparent max-md:px-4 max-md:py-4 max-md:shadow-none max-md:backdrop-blur-none",
        )}
      >
        <a
          href="#hero"
          className={cn(
            "group flex items-center gap-2.5",
            menuOpen && "max-md:hidden",
          )}
        >
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
          <LocaleDropdown
            className={cn("hidden sm:block", menuOpen && "max-md:hidden")}
          />

          <ThemeToggle className={cn(menuOpen && "max-md:hidden")} />

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
            className={cn(
              "relative z-60 flex h-9 w-9 items-center justify-center rounded-lg border border-border-default bg-bg-tertiary text-text-primary transition-colors hover:border-accent hover:text-accent md:hidden",
              menuOpen && "border-accent text-accent",
            )}
            onClick={() => setMenuOpen((open) => !open)}
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
            className="fixed inset-0 z-40 flex flex-col overscroll-none bg-bg-primary/95 backdrop-blur-xl md:hidden"
          >
            <div
              ref={mobileMenuRef}
              className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-6 pt-20 sm:px-8"
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
                      hidden: reduce
                        ? { opacity: 0 }
                        : { opacity: 0, x: isRtl ? 16 : -16 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    className={cn(
                      "wrap-break-word border-b border-border-subtle py-4 text-2xl font-semibold transition-colors sm:text-3xl",
                      activeSection === link.id
                        ? "text-accent"
                        : "text-text-primary",
                    )}
                  >
                    {t(link.key)}
                  </motion.a>
                ))}
              </motion.nav>
            </div>

            <div className="shrink-0 px-6 pb-8 pt-4 sm:px-8">
              <div className="flex items-center justify-between gap-4">
                <LocaleDropdown
                  align="start"
                  placement="above"
                  onSelect={() => setMenuOpen(false)}
                />
                <ThemeToggle />
              </div>

              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="btn-primary mt-6 justify-center py-3 text-base"
              >
                {t("contact")}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
