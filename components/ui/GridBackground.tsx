"use client";

/**
 * Ambient background for the Hero section.
 * Three soft blurred blobs — no grid, no animations.
 * Inspired by Linear / Vercel: calm, refined, modern.
 */
export function GridBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* top-center radial — subtle accent bloom */}
      <div
        className="absolute inset-x-0 top-0 h-[70%]"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% -5%, var(--accent-dim) 0%, transparent 65%)",
        }}
      />

      {/* top-right blob */}
      <div
        className="absolute -right-32 -top-20 h-[480px] w-[480px] rounded-full opacity-30 blur-[120px]"
        style={{ background: "var(--accent)" }}
      />

      {/* bottom-left blob */}
      <div
        className="absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full opacity-20 blur-[140px]"
        style={{ background: "var(--accent-2)" }}
      />

      {/* very subtle noise vignette at the bottom edge */}
      <div
        className="absolute inset-x-0 bottom-0 h-48"
        style={{
          background:
            "linear-gradient(to top, var(--bg-primary) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
