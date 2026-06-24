import { useCallback } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      ready: (callback: () => void) => void;
    };
  }
}

/**
 * Drop-in replacement for `useGoogleReCaptcha` from react-google-recaptcha-v3.
 * Uses the globally-loaded reCAPTCHA script (loaded via next/script in layout.tsx)
 * instead of a React context, avoiding the React 19 script-tag warning.
 */
export function useRecaptcha() {
  const executeRecaptcha = useCallback(
    async (action: string): Promise<string> => {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (!siteKey || typeof window === "undefined" || !window.grecaptcha?.execute) {
        return "";
      }
      try {
        return await window.grecaptcha.execute(siteKey, { action });
      } catch {
        return "";
      }
    },
    [],
  );

  return { executeRecaptcha };
}
