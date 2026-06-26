"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { cn } from "@/lib/utils";

export type FooterCatProps = {
  src?: string;
  className?: string;
  width?: number;
  height?: number;
  watchRef?: RefObject<Element | null>;
};

export function FooterCat({
  src = "/videos/cat-waving.webp",
  className,
  width = 360,
  height = 360,
  watchRef,
}: FooterCatProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const target = watchRef?.current ?? container;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05, rootMargin: "120px 0px" },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [watchRef]);

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none", className)}
      style={{ width, height }}
    >
      {visible ? (
        <img
          src={src}
          alt=""
          width={width}
          height={height}
          decoding="async"
          className="h-full w-full object-contain"
          aria-hidden
        />
      ) : null}
    </div>
  );
}

/** @deprecated Use FooterCat */
export const TransparentVideo = FooterCat;
