"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type React from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

function FocusRing({ focused }: { focused: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-center rounded-full bg-accent/50 will-change-transform"
      initial={false}
      animate={{ scaleX: focused ? 1 : 0 }}
      transition={{ duration: reduce ? 0 : 0.25, ease: "easeOut" }}
    />
  );
}

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function FormInput({ label, error, id, className, ...props }: FormInputProps) {
  const inputId = id ?? props.name;
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-[13px] font-medium text-text-primary">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          className={cn("form-input", error && "border-red-500", className)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        <FocusRing focused={focused} />
      </div>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.p
      role="alert"
      className="text-xs text-red-500"
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {message}
    </motion.p>
  );
}

type FormTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function FormTextarea({
  label,
  error,
  id,
  className,
  ...props
}: FormTextareaProps) {
  const inputId = id ?? props.name;
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-[13px] font-medium text-text-primary">
        {label}
      </label>
      <div className="relative">
        <textarea
          id={inputId}
          className={cn(
            "form-input min-h-[140px] resize-y",
            error && "border-red-500",
            className
          )}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        <FocusRing focused={focused} />
      </div>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

type FormSelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> & {
  label: string;
  options: { value: string; label: string }[];
};

export function FormSelect({
  label,
  options,
  id,
  name,
  className,
  defaultValue,
}: FormSelectProps) {
  const inputId = id ?? name;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState<string>(
    () => (defaultValue as string | undefined) ?? options[0]?.value ?? "",
  );

  const placeholder = options.find((opt) => opt.value === "")?.label ?? "—";
  const selectableOptions = options.filter((opt) => opt.value !== "");
  const selected = options.find((opt) => opt.value === value);

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
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-[13px] font-medium text-text-primary">
        {label}
      </label>

      <input type="hidden" name={name} value={value} />

      <div ref={ref} className="relative">
        <button
          type="button"
          id={inputId}
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={() => setOpen((prev) => !prev)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            "form-input flex w-full cursor-pointer items-center justify-between gap-3 text-start",
            !value && "text-text-tertiary",
            open && "border-accent",
            className,
          )}
        >
          <span className="truncate">
            {value ? selected?.label : placeholder}
          </span>
          <ChevronDown
            size={16}
            aria-hidden
            className={cn(
              "shrink-0 text-text-tertiary transition-transform duration-200",
              open && "rotate-180 text-accent",
            )}
          />
        </button>

        <FocusRing focused={focused || open} />

        <AnimatePresence>
          {open && (
            <motion.ul
              role="listbox"
              aria-label={label}
              initial={reduce ? false : { opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, y: -6, scale: 0.98 }}
              transition={{
                duration: reduce ? 0 : 0.18,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="absolute inset-x-0 top-[calc(100%+0.375rem)] z-50 max-h-60 overflow-y-auto rounded-xl border border-border-default bg-bg-secondary p-1 shadow-elevated backdrop-blur-xl"
            >
              {selectableOptions.map((opt) => {
                const isActive = value === opt.value;
                return (
                  <li key={opt.value} role="option" aria-selected={isActive}>
                    <button
                      type="button"
                      onClick={() => {
                        setValue(opt.value);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-start text-[14px] transition-colors",
                        isActive
                          ? "bg-accent-dim font-medium text-accent"
                          : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary",
                      )}
                    >
                      <span>{opt.label}</span>
                      {isActive && (
                        <Check size={14} aria-hidden className="shrink-0" />
                      )}
                    </button>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
