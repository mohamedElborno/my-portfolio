"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { cn } from "@/lib/utils";

export type FooterCatProps = {
  src?: string;
  className?: string;
  width?: number;
  height?: number;
  watchRef?: RefObject<Element | null>;
};

export function FooterCat({
  src = "/videos/tmpmei0flrf.webm",
  className,
  width = 60,
  height = 60,
  watchRef,
}: FooterCatProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const play = async () => {
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        video.load();
        await new Promise<void>((resolve) => {
          video.addEventListener("loadeddata", () => resolve(), { once: true });
        });
      }

      try {
        await video.play();
      } catch {
        // Autoplay blocked — ignore.
      }
    };

    const pause = () => {
      video.pause();
    };

    const target = watchRef?.current ?? container;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void play();
        else pause();
      },
      { threshold: 0.05, rootMargin: "120px 0px" },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
      pause();
    };
  }, [src, width, height, watchRef]);

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none", className)}
      style={{ width, height }}
    >
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="none"
        className="h-full w-full object-contain"
        aria-label="Waving cat"
      >
        <source src={src} type="video/webm" />
      </video>
    </div>
  );
}

/** @deprecated Use FooterCat */
export const TransparentVideo = FooterCat;
