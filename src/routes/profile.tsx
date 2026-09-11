import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Settings2, Sparkles, BookOpen, LogOut } from "lucide-react";
import { AppShell } from "@/components/uboo/AppShell";
import { GlassCard } from "@/components/uboo/Glass";
import { SettingsGroup, SettingsRow } from "@/components/uboo/SettingsRow";
import { Mascot } from "@/components/uboo/Mascot";
import { useUboo } from "@/lib/uboo-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile • Uboo" },
      {
        name: "description",
        content: "Your Uboo profile — conversations, memories and voice sessions at a glance.",
      },
      { property: "og:title", content: "Profile • Uboo" },
      {
        property: "og:description",
        content: "Your companion profile and preferences.",
      },
    ],
  }),
  component: ProfileScreen,
});

function ProfileScreen() {
  const { profile, conversations, memories, resetOnboarding } = useUboo();
  const navigate = useNavigate();

  const stats = [
    { label: "Conversations", value: conversations.length },
    { label: "Memories", value: memories.length },
    { label: "Voice sessions", value: 24 },
  ];

  return (
    <AppShell>
      <GlassCard className="animate-enter flex flex-col items-center p-8 text-center">
        <div className="grid size-28 place-items-center rounded-full glass-tint">
          <Mascot state="happy" size={104} />
        </div>
        <h1 className="mt-4 text-2xl font-semibold">{profile.name}</h1>
        <p className="text-sm italic text-muted-foreground">{profile.tagline}</p>

        <div className="mt-6 grid w-full grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl px-2 py-4">
              <p className="text-xl font-semibold">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="mt-6 space-y-6">
        <SettingsGroup title="Companion">
          <SettingsRow
            label="Instructions & personality"
            description="How Uboo talks to you"
            chevron
            control={<Sparkles className="size-4 text-[var(--deep)]" />}
            onClick={() => navigate({ to: "/instructions" })}
          />
          <SettingsRow
            label="Memory"
            description={`${memories.length} things remembered`}
            chevron
            onClick={() => navigate({ to: "/memory" })}
          />
        </SettingsGroup>

        <SettingsGroup title="App">
          <SettingsRow
            label="Settings"
            description="Voice, appearance, privacy"
            chevron
            control={<Settings2 className="size-4 text-[var(--deep)]" />}
            onClick={() => navigate({ to: "/settings" })}
          />
          <SettingsRow
            label="Replay onboarding"
            description="Meet your companion again"
            chevron
            control={<BookOpen className="size-4 text-[var(--deep)]" />}
            onClick={() => {
              resetOnboarding();
              navigate({ to: "/onboarding" });
            }}
          />
          <SettingsRow
            label="Sign out"
            danger
            control={<LogOut className="size-4" />}
            onClick={() => undefined}
          />
        </SettingsGroup>
      </div>
    </AppShell>
  );
}
