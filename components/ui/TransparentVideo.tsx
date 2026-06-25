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

function chromaAlpha(r: number, g: number, b: number): number {
  const dominance = g - Math.max(r, b);
  if (dominance < 20) return 255;
  const strength = Math.min((dominance - 20) / 60, 1);
  return Math.round((1 - strength) * 255);
}

// requestVideoFrameCallback fires only when the video has a new frame —
// no wasted work between frames, unlike requestAnimationFrame.
const supportsVFC =
  typeof window !== "undefined" &&
  "requestVideoFrameCallback" in HTMLVideoElement.prototype;

export function FooterCat({
  src = "/videos/foreground.mp4",
  className,
  width = 60,
  height = 60,
  watchRef,
}: FooterCatProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const callbackIdRef = useRef(0);
  const activeRef = useRef(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!container || !video || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const supportsVFC = "requestVideoFrameCallback" in video;

    const paintFrame = () => {
      if (video.videoWidth <= 0) return;

      ctx.drawImage(video, 0, 0, width, height);

      try {
        const frame = ctx.getImageData(0, 0, width, height);
        const { data } = frame;

        for (let i = 0; i < data.length; i += 4) {
          const a = chromaAlpha(data[i], data[i + 1], data[i + 2]);
          if (a < 255) data[i + 3] = a;
        }

        ctx.putImageData(frame, 0, 0);
      } catch {
        ctx.drawImage(video, 0, 0, width, height);
      }
    };

    // VFC path: fires only when video has a new decoded frame (best for perf).
    const scheduleVFC = () => {
      if (!activeRef.current) return;
      callbackIdRef.current = video.requestVideoFrameCallback(() => {
        paintFrame();
        scheduleVFC();
      });
    };

    // rAF fallback: throttled to actual video FPS via currentTime check.
    let lastMediaTime = -1;
    const rafTick = () => {
      if (!activeRef.current) return;
      if (
        video.currentTime !== lastMediaTime &&
        !video.paused &&
        !video.ended
      ) {
        lastMediaTime = video.currentTime;
        paintFrame();
      }
      callbackIdRef.current = requestAnimationFrame(rafTick);
    };

    const startLoop = () => {
      if (activeRef.current) return;
      activeRef.current = true;
      paintFrame();
      if (supportsVFC) {
        scheduleVFC();
      } else {
        callbackIdRef.current = requestAnimationFrame(rafTick);
      }
    };

    const stopLoop = () => {
      activeRef.current = false;
      if (supportsVFC) {
        video.cancelVideoFrameCallback(callbackIdRef.current);
      } else {
        cancelAnimationFrame(callbackIdRef.current);
      }
    };
    const play = async () => {
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        video.load();
        await new Promise<void>((resolve) => {
          video.addEventListener("loadeddata", () => resolve(), { once: true });
        });
      }

      try {
        await video.play();
        startLoop();
      } catch {
        // Autoplay blocked — ignore.
      }
    };

    const pause = () => {
      video.pause();
      stopLoop();
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
        src={src}
        loop
        muted
        playsInline
        preload="none"
        className="pointer-events-none absolute h-px w-px opacity-0"
        aria-hidden
      />
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        aria-label="Waving cat"
      />
    </div>
  );
}

/** @deprecated Use FooterCat */
export const TransparentVideo = FooterCat;
