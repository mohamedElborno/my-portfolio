import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: "outline" | "accent" | "stat";
};

export function Badge({
  children,
  className,
  variant = "outline",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        variant === "outline" && "tag-pill",
        variant === "accent" && "tag-pill-accent",
        variant === "stat" && "stat-pill",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
