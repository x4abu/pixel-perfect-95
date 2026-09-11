import { Link, useRouterState } from "@tanstack/react-router";
import { Home, MessagesSquare, Brain, User, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/chats", label: "Chats", icon: MessagesSquare },
  { to: "/memory", label: "Memory", icon: Brain },
  { to: "/profile", label: "Profile", icon: User },
] as const;

function isActive(pathname: string, to: string) {
  return to === "/" ? pathname === "/" : pathname.startsWith(to);
}

export function Atmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 atmosphere">
      <div
        className="absolute -left-32 top-10 size-[36rem] animate-drift rounded-full blur-3xl"
        style={{ background: "oklch(0.92 0.11 128 / 0.35)" }}
      />
      <div
        className="absolute -right-40 top-1/3 size-[32rem] animate-drift rounded-full blur-3xl"
        style={{ background: "oklch(0.96 0.04 200 / 0.5)", animationDelay: "-6s" }}
      />
      <div
        className="absolute bottom-[-12rem] left-1/3 size-[34rem] animate-drift rounded-full blur-3xl"
        style={{ background: "oklch(0.94 0.07 140 / 0.4)", animationDelay: "-11s" }}
      />
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen">
      <Atmosphere />

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[248px] flex-col justify-between p-5 lg:flex">
        <div>
          <Link to="/" className="mb-8 flex items-center gap-3 px-2">
            <span className="grid size-10 place-items-center rounded-2xl bg-[var(--primary)] shadow-[var(--shadow-glow)]">
              <Sparkles className="size-5 text-primary-foreground" strokeWidth={2} />
            </span>
            <span>
              <span className="block text-lg font-semibold leading-none">Uboo</span>
              <span className="text-xs italic text-muted-foreground">voice companion</span>
            </span>
          </Link>

          <nav className="glass flex flex-col gap-1 rounded-3xl p-2">
            {nav.map((item) => {
              const active = isActive(pathname, item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "press flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-[var(--primary)] text-primary-foreground shadow-[var(--shadow-soft)]"
                      : "text-muted-foreground hover:bg-white/60 hover:text-foreground",
                  )}
                >
                  <item.icon className="size-[18px]" strokeWidth={1.8} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <Link
          to="/voice"
          className="press glass-tint flex items-center justify-center gap-2 rounded-3xl px-4 py-4 text-sm font-semibold"
        >
          Live voice
        </Link>
      </aside>

      <main className="mx-auto w-full max-w-3xl px-5 pb-36 pt-8 lg:ml-[248px] lg:max-w-4xl lg:px-10 lg:pb-16">
        {children}
      </main>

      {/* Mobile floating nav */}
      <nav
        className="glass-strong fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex items-center justify-around rounded-full px-2 py-2 lg:hidden"
        aria-label="Main"
      >
        {nav.map((item) => {
          const active = isActive(pathname, item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-label={item.label}
              className={cn(
                "press flex min-w-16 flex-col items-center gap-1 rounded-full px-4 py-2 text-[11px] font-medium",
                active
                  ? "bg-[var(--primary)] text-primary-foreground"
                  : "text-muted-foreground",
              )}
            >
              <item.icon className="size-[19px]" strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
