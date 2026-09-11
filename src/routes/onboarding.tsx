import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Atmosphere } from "@/components/uboo/AppShell";
import { GlassButton } from "@/components/uboo/Glass";
import { Mascot } from "@/components/uboo/Mascot";
import { useUboo } from "@/lib/uboo-store";
import { cn } from "@/lib/utils";
import type { VoiceState } from "@/lib/use-voice-state";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Meet Uboo — your AI companion" },
      {
        name: "description",
        content:
          "A short introduction to Uboo: talk naturally, let it remember what matters, and teach it how to speak with you.",
      },
      { property: "og:title", content: "Meet Uboo — your AI companion" },
      {
        property: "og:description",
        content: "Talk naturally. It listens, remembers and learns your tone.",
      },
    ],
  }),
  component: Onboarding,
});

const steps: Array<{ title: string; body: string; state: VoiceState }> = [
  {
    title: "Meet your AI companion.",
    body: "This is Uboo. Calm, curious and always around when you feel like talking.",
    state: "happy",
  },
  {
    title: "Just talk. It listens.",
    body: "No prompts to write. Tap once and speak the way you'd speak to a friend.",
    state: "listening",
  },
  {
    title: "It remembers what matters.",
    body: "Preferences, people, goals — kept only if you want them kept.",
    state: "thinking",
  },
  {
    title: "Teach it how to talk to you.",
    body: "Short answers, casual tone, a little Hinglish. You decide the personality.",
    state: "speaking",
  },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const { completeOnboarding } = useUboo();
  const navigate = useNavigate();
  const step = steps[i]!;
  const last = i === steps.length - 1;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between px-6 py-[max(2rem,env(safe-area-inset-top))] text-center">
      <Atmosphere />

      <button
        type="button"
        onClick={() => {
          completeOnboarding();
          navigate({ to: "/" });
        }}
        className="press self-end text-xs text-muted-foreground"
      >
        Skip
      </button>

      <div key={i} className="animate-enter flex flex-col items-center">
        <Mascot state={step.state} amplitude={0.5} size={300} />
        <h1 className="mt-4 max-w-md text-[clamp(1.8rem,5vw,2.6rem)] font-semibold leading-tight">
          {step.title}
        </h1>
        <p className="mt-3 max-w-sm text-sm italic leading-relaxed text-muted-foreground">
          {step.body}
        </p>
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center gap-2">
          {steps.map((_, n) => (
            <span
              key={n}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                n === i ? "w-6 bg-[var(--deep)]" : "w-1.5 bg-muted-foreground/30",
              )}
            />
          ))}
        </div>
        <GlassButton
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => {
            if (last) {
              completeOnboarding();
              navigate({ to: "/" });
            } else setI((n) => n + 1);
          }}
        >
          {last ? "Start talking" : "Continue"}
        </GlassButton>
      </div>
    </div>
  );
}
