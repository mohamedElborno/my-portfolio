"use client";

import { createPortal } from "react-dom";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function BrowserChrome({
  url,
  children,
  className,
}: {
  url?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border-subtle bg-bg-secondary shadow-card",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-border-subtle bg-bg-tertiary px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
        <div className="mx-3 min-w-0 flex-1 overflow-hidden rounded-md bg-bg-elevated px-3 py-1 text-center text-[11px] text-text-tertiary">
          <span className="truncate">{url}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

export function ImageHoverPreview({
  src,
  alt,
  url,
  contain = false,
  children,
}: {
  src: string;
  alt: string;
  url?: string;
  contain?: boolean;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const preview = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="screenshot-preview"
          className="pointer-events-none fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.18 }}
          aria-hidden
        >
          <div className="absolute inset-0 bg-bg-primary/88 backdrop-blur-md" />
          <motion.div
            className="relative z-10 w-full max-w-6xl"
            initial={reduce ? false : { opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.94, y: 10 }}
            transition={{
              duration: reduce ? 0 : 0.28,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
          >
            <BrowserChrome url={url} className="shadow-elevated">
              <div
                className={cn(
                  "flex w-full items-center justify-center bg-[#0b0e18]",
                  contain && "p-6 sm:p-10",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="block h-auto max-h-[78vh] w-auto max-w-full object-contain"
                  draggable={false}
                />
              </div>
            </BrowserChrome>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div
        className="cursor-zoom-in"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-label={alt}
      >
        {children}
      </div>
      {mounted && createPortal(preview, document.body)}
    </>
  );
}
