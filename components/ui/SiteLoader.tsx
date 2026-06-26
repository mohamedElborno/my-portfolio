"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { DowLoader } from "@/components/ui/DowLoader";

const MIN_VISIBLE_MS = 0;
const MAX_VISIBLE_MS = 6000;

export function SiteLoader() {
  const t = useTranslations("siteLoader");
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(!reduce);

  useEffect(() => {
    if (reduce) return;

    let finished = false;
    const startedAt = Date.now();

    const hide = () => {
      if (finished) return;
      finished = true;
      setVisible(false);
    };

    const hideAfterMin = () => {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(hide, remaining);
    };

    if (document.readyState === "complete") {
      hideAfterMin();
    } else {
      window.addEventListener("load", hideAfterMin, { once: true });
    }

    const safetyTimer = window.setTimeout(hide, MAX_VISIBLE_MS);

    return () => {
      window.removeEventListener("load", hideAfterMin);
      window.clearTimeout(safetyTimer);
    };
  }, [reduce]);

  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="site-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-bg-primary"
          role="status"
          aria-live="polite"
          aria-label={t("label")}
        >
          <DowLoader size={72} label={t("label")} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
