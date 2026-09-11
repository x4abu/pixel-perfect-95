import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowUpRight, Brain, Sparkles, Waves } from "lucide-react";
import { AppShell } from "@/components/uboo/AppShell";
import { GlassCard, GlassButton } from "@/components/uboo/Glass";
import { Mascot } from "@/components/uboo/Mascot";
import { MicrophoneButton } from "@/components/uboo/MicrophoneButton";
import { VoiceVisualizer } from "@/components/uboo/VoiceVisualizer";
import { stateLabel, useVoiceState } from "@/lib/use-voice-state";
import { useUboo } from "@/lib/uboo-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Uboo — Talk to your AI companion" },
      {
        name: "description",
        content:
          "Say hello to Uboo. A calm voice companion you can just talk to — it listens, thinks and remembers what matters to you.",
      },
      { property: "og:title", content: "Uboo — Talk to your AI companion" },
      {
        property: "og:description",
        content: "A calm AI voice companion you can just talk to.",
      },
    ],
  }),
  component: Home,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function Home() {
  const { profile, onboarded, hydrated, conversations, memories } = useUboo();
  const voice = useVoiceState();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !onboarded) navigate({ to: "/onboarding" });
  }, [hydrated, onboarded, navigate]);

  return (
    <AppShell>
      <div className="flex flex-col items-center">
        <header className="w-full animate-enter">
          <p className="text-sm text-muted-foreground">
            {greeting()}, {profile.name}
          </p>
          <h1 className="mt-1 text-[clamp(2.1rem,6vw,3.2rem)] font-semibold leading-[1.05]">
            Ready to talk?
          </h1>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-[var(--deep)]" />
            AI companion • Online
          </p>
        </header>

        <div className="mt-6 grid w-full place-items-center">
          <Mascot state={voice.state} amplitude={voice.amplitude} size={280} />
          <p className="-mt-2 text-base italic text-muted-foreground">
            {stateLabel[voice.state]}
          </p>
          <VoiceVisualizer
            state={voice.state}
            amplitude={voice.amplitude}
            className="mt-2 max-w-sm opacity-90"
          />
          <MicrophoneButton
            state={voice.state}
            amplitude={voice.amplitude}
            onToggle={voice.toggle}
            className="mt-4"
          />
          <Link to="/voice" className="mt-5">
            <GlassButton size="sm" variant="ghost">
              Open live voice <ArrowUpRight className="size-4" />
            </GlassButton>
          </Link>
        </div>

        <div className="mt-10 grid w-full gap-4 sm:grid-cols-3">
          <Link to="/chats">
            <GlassCard interactive className="h-full p-5">
              <Waves className="size-5 text-[var(--deep)]" strokeWidth={1.8} />
              <p className="mt-3 text-sm font-semibold">Conversations</p>
              <p className="text-xs text-muted-foreground">
                {conversations.length} saved
              </p>
            </GlassCard>
          </Link>
          <Link to="/memory">
            <GlassCard interactive className="h-full p-5">
              <Brain className="size-5 text-[var(--deep)]" strokeWidth={1.8} />
              <p className="mt-3 text-sm font-semibold">Memory</p>
              <p className="text-xs text-muted-foreground">{memories.length} things known</p>
            </GlassCard>
          </Link>
          <Link to="/instructions">
            <GlassCard interactive className="h-full p-5">
              <Sparkles className="size-5 text-[var(--deep)]" strokeWidth={1.8} />
              <p className="mt-3 text-sm font-semibold">Personality</p>
              <p className="text-xs text-muted-foreground">Teach it your tone</p>
            </GlassCard>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
