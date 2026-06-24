import { useCallback } from "react";
import { loadRecaptchaScript } from "@/lib/loadRecaptcha";

export function useRecaptcha() {
  const executeRecaptcha = useCallback(async (action: string): Promise<string> => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey || typeof window === "undefined") return "";

    try {
      await loadRecaptchaScript();
      if (!window.grecaptcha?.execute) return "";

      return await new Promise<string>((resolve) => {
        window.grecaptcha!.ready(async () => {
          try {
            resolve(await window.grecaptcha!.execute(siteKey, { action }));
          } catch {
            resolve("");
          }
        });
      });
    } catch {
      return "";
    }
  }, []);

  return { executeRecaptcha, loadRecaptchaScript };
}
