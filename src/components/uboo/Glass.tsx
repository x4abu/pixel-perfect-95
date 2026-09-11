import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export function GlassCard({
  className,
  interactive,
  tint,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { interactive?: boolean; tint?: boolean }) {
  return (
    <div
      className={cn(
        tint ? "glass-tint" : "glass",
        "rounded-3xl",
        interactive &&
          "cursor-pointer transition-[transform,box-shadow] duration-300 ease-[var(--ease-calm)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "glass" | "primary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  children?: ReactNode;
};

export function GlassButton({
  className,
  variant = "glass",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "press inline-flex items-center justify-center gap-2 rounded-full font-medium",
        "disabled:pointer-events-none disabled:opacity-50",
        size === "sm" && "h-9 px-4 text-sm",
        size === "md" && "h-11 px-5 text-sm",
        size === "lg" && "h-14 px-8 text-base",
        size === "icon" && "h-11 w-11",
        variant === "glass" && "glass text-foreground hover:bg-white/70",
        variant === "primary" &&
          "specular bg-[var(--primary)] text-primary-foreground shadow-[var(--shadow-glow)] hover:brightness-105",
        variant === "ghost" && "text-muted-foreground hover:bg-white/50",
        variant === "danger" && "glass text-destructive hover:bg-white/70",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SectionTitle({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <header className={cn("animate-enter", className)}>
      <h1 className="text-[clamp(1.9rem,4vw,2.6rem)] font-semibold leading-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-sm italic text-muted-foreground">{subtitle}</p>}
    </header>
  );
}
