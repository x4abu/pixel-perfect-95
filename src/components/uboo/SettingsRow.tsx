import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./Glass";

export function SettingsGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="animate-enter">
      <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </h2>
      <GlassCard className="divide-y divide-white/60 overflow-hidden">{children}</GlassCard>
    </section>
  );
}

export function SettingsRow({
  label,
  description,
  control,
  onClick,
  chevron,
  danger,
}: {
  label: string;
  description?: string;
  control?: ReactNode;
  onClick?: () => void;
  chevron?: boolean;
  danger?: boolean;
}) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      {...(onClick ? { onClick, type: "button" as const } : {})}
      className={cn(
        "flex w-full items-center justify-between gap-4 px-5 py-4 text-left",
        onClick && "press hover:bg-white/50",
      )}
    >
      <span className="min-w-0">
        <span
          className={cn(
            "block text-sm font-medium",
            danger ? "text-destructive" : "text-foreground",
          )}
        >
          {label}
        </span>
        {description && (
          <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
        )}
      </span>
      <span className="flex shrink-0 items-center gap-2">
        {control}
        {chevron && <ChevronRight className="size-4 text-muted-foreground" />}
      </span>
    </Wrapper>
  );
}

export function Pill({
  active,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "press rounded-full px-4 py-2 text-sm font-medium",
        active
          ? "bg-[var(--primary)] text-primary-foreground shadow-[var(--shadow-soft)]"
          : "glass text-muted-foreground hover:text-foreground",
      )}
      {...props}
    >
      {children}
    </button>
  );
}
