import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronRight, Plus, Search } from "lucide-react";
import { AppShell } from "@/components/uboo/AppShell";
import { GlassCard, SectionTitle } from "@/components/uboo/Glass";
import { useUboo } from "@/lib/uboo-store";

export const Route = createFileRoute("/chats/")({
  head: () => ({
    meta: [
      { title: "Conversations • Uboo" },
      {
        name: "description",
        content: "Browse and search every conversation you've had with your Uboo companion.",
      },
      { property: "og:title", content: "Conversations • Uboo" },
      {
        property: "og:description",
        content: "Every conversation with your AI companion, in one calm place.",
      },
    ],
  }),
  component: Chats,
});

function Chats() {
  const { conversations, startConversation } = useUboo();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return conversations;
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(t) || c.preview.toLowerCase().includes(t),
    );
  }, [conversations, q]);

  return (
    <AppShell>
      <SectionTitle title="Conversations" subtitle="Your recent conversations" />

      <div className="glass mt-6 flex items-center gap-3 rounded-full px-5 py-3">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search conversations"
          aria-label="Search conversations"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-5 space-y-3">
        {list.map((c, i) => (
          <Link key={c.id} to="/chats/$id" params={{ id: c.id }}>
            <GlassCard
              interactive
              className="animate-enter flex items-center gap-4 p-4"
              style={{ animationDelay: `${i * 45}ms` }}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl glass-tint text-sm font-semibold">
                {c.title.slice(0, 1)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm font-semibold">{c.title}</span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{c.when}</span>
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {c.preview}
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </GlassCard>
          </Link>
        ))}
        {list.length === 0 && (
          <p className="py-16 text-center text-sm italic text-muted-foreground">
            Nothing matches "{q}" yet.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          const id = startConversation();
          navigate({ to: "/chats/$id", params: { id } });
        }}
        aria-label="New conversation"
        className="press specular fixed bottom-28 right-5 z-30 grid size-14 place-items-center rounded-full bg-[var(--primary)] text-primary-foreground shadow-[var(--shadow-glow)] lg:bottom-10 lg:right-10"
      >
        <Plus className="size-6" />
      </button>
    </AppShell>
  );
}
