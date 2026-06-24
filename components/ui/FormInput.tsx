"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
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

type FormSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: { value: string; label: string }[];
};

export function FormSelect({ label, options, id, className, ...props }: FormSelectProps) {
  const inputId = id ?? props.name;
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-[13px] font-medium text-text-primary">
        {label}
      </label>
      <div className="relative">
        <select
          id={inputId}
          className={cn("form-input", className)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <FocusRing focused={focused} />
      </div>
    </div>
  );
}
