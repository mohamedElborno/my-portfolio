"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  motion,
  AnimatePresence,
  useAnimation,
  useReducedMotion,
} from "framer-motion";
import { useAction } from "convex/react";
import { useRecaptcha } from "@/lib/useRecaptcha";
import { ArrowRight } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { FormInput, FormTextarea, FormSelect } from "@/components/ui/FormInput";
import { DowLoader } from "@/components/ui/DowLoader";
import { staggerItem, errorShake } from "@/lib/animations";
import { cn } from "@/lib/utils";

type FormErrors = Partial<
  Record<"name" | "email" | "subject" | "message", string>
>;
type Status = "idle" | "loading" | "success" | "error";

const fieldContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

function Field({
  children,
  shake,
  reduce,
}: {
  children: React.ReactNode;
  shake: boolean;
  reduce: boolean;
}) {
  const controls = useAnimation();
  useEffect(() => {
    if (shake && !reduce) controls.start(errorShake);
  }, [shake, reduce, controls]);
  return (
    <motion.div variants={reduce ? undefined : staggerItem} animate={controls}>
      {children}
    </motion.div>
  );
}

export function ContactForm() {
  const t = useTranslations("form");
  const locale = useLocale() as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const reduce = useReducedMotion();
  const submitForm = useAction(api.contact.submitContactForm);
  const { executeRecaptcha, loadRecaptchaScript } = useRecaptcha();
  const buttonControls = useAnimation();
  const recaptchaLoadQueued = useRef(false);

  const queueRecaptchaLoad = () => {
    if (recaptchaLoadQueued.current) return;
    recaptchaLoadQueued.current = true;
    void loadRecaptchaScript();
  };

  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FormErrors>({});

  const budgetOptions = [
    { value: "", label: "—" },
    { value: "under500", label: t("budgetOptions.under500") },
    { value: "500to2000", label: t("budgetOptions.500to2000") },
    { value: "2000to5000", label: t("budgetOptions.2000to5000") },
    { value: "over5000", label: t("budgetOptions.over5000") },
    { value: "discuss", label: t("budgetOptions.discuss") },
  ];

  function validate(data: FormData): FormErrors {
    const next: FormErrors = {};
    const name = (data.get("name") as string)?.trim() ?? "";
    const email = (data.get("email") as string)?.trim() ?? "";
    const subject = (data.get("subject") as string)?.trim() ?? "";
    const message = (data.get("message") as string)?.trim() ?? "";

    if (name.length < 2) next.name = t("validation.nameMin");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = t("validation.emailInvalid");
    if (!subject) next.subject = t("validation.subjectRequired");
    if (message.length < 20) next.message = t("validation.messageMin");

    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const validationErrors = validate(data);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setStatus("loading");

    try {
      let recaptchaToken = "";
      if (executeRecaptcha)
        recaptchaToken = await executeRecaptcha("contact_form");

      const budgetKey = (data.get("budget") as string) || "discuss";
      const budgetLabel =
        budgetOptions.find((o) => o.value === budgetKey)?.label ?? "";

      await submitForm({
        name: data.get("name") as string,
        email: data.get("email") as string,
        subject: data.get("subject") as string,
        budget: budgetLabel,
        message: data.get("message") as string,
        recaptchaToken,
        lang: locale,
        submittedAt: Date.now(),
      });

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      if (!reduce) buttonControls.start(errorShake);
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-accent/30 bg-accent-dim p-8 text-center"
      >
        <motion.svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          className="mx-auto mb-4 text-accent"
          aria-hidden
        >
          <motion.path
            d="M4 12l5 5L20 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </motion.svg>
        <p className="text-lg font-medium text-text-primary">{t("success")}</p>
      </motion.div>
    );
  }

  return (
    <div className="relative">
      <motion.form
        onSubmit={handleSubmit}
        noValidate
        className={cn(
          "space-y-5 transition-[filter,opacity] duration-300",
          status === "loading" && "pointer-events-none blur-[3px] opacity-60",
        )}
        variants={reduce ? undefined : fieldContainer}
        initial={reduce ? undefined : "hidden"}
        whileInView={reduce ? undefined : "visible"}
        viewport={{ once: true, margin: "-40px" }}
        aria-busy={status === "loading"}
      >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field shake={!!errors.name} reduce={!!reduce}>
          <div
            onMouseEnter={queueRecaptchaLoad}
            onFocusCapture={queueRecaptchaLoad}
          >
            <FormInput
              name="name"
              label={t("name")}
              required
              autoComplete="name"
              error={errors.name}
            />
          </div>
        </Field>
        <Field shake={!!errors.email} reduce={!!reduce}>
          <FormInput
            name="email"
            type="email"
            label={t("email")}
            required
            autoComplete="email"
            error={errors.email}
          />
        </Field>
      </div>

      <Field shake={!!errors.subject} reduce={!!reduce}>
        <FormInput
          name="subject"
          label={t("subject")}
          required
          error={errors.subject}
        />
      </Field>

      <Field shake={false} reduce={!!reduce}>
        <FormSelect name="budget" label={t("budget")} options={budgetOptions} />
      </Field>

      <Field shake={!!errors.message} reduce={!!reduce}>
        <FormTextarea
          name="message"
          label={t("message")}
          required
          error={errors.message}
        />
      </Field>

      <motion.div variants={reduce ? undefined : staggerItem}>
        <motion.button
          type="submit"
          disabled={status === "loading"}
          animate={buttonControls}
          whileHover={reduce || status === "loading" ? undefined : { y: -2 }}
          whileTap={
            reduce || status === "loading" ? undefined : { y: 1, scale: 0.98 }
          }
          className={cn(
            "btn-primary h-12 w-full justify-center overflow-hidden will-change-transform cursor-pointer",
            status === "error" && "bg-red-500/90!",
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {status === "loading" ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {t("submitting")}
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                {isRtl && (
                  <ArrowRight size={16} className="rtl-flip" aria-hidden />
                )}
                {t("submit")}
                {!isRtl && <ArrowRight size={16} aria-hidden />}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {status === "error" && (
        <motion.p
          role="alert"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-sm text-red-500"
        >
          {t("error")}
        </motion.p>
      )}

      <p className="text-[11px] text-text-tertiary">
        {t.rich("recaptchaNotice", {
          privacy: (chunks) => (
            <a
              href="https://policies.google.com/privacy"
              className="underline hover:text-accent"
              target="_blank"
              rel="noopener noreferrer"
            >
              {chunks}
            </a>
          ),
          terms: (chunks) => (
            <a
              href="https://policies.google.com/terms"
              className="underline hover:text-accent"
              target="_blank"
              rel="noopener noreferrer"
            >
              {chunks}
            </a>
          ),
        })}
      </p>
      </motion.form>

      <AnimatePresence>
        {status === "loading" && (
          <motion.div
            key="form-loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
            aria-hidden
          >
            <DowLoader
              size={56}
              label={t("submitting")}
              className="text-text-primary"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
