import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/uboo/AppShell";
import { GlassCard, GlassButton, SectionTitle } from "@/components/uboo/Glass";
import { Pill } from "@/components/uboo/SettingsRow";
import { Mascot } from "@/components/uboo/Mascot";
import { useUboo } from "@/lib/uboo-store";

export const Route = createFileRoute("/instructions")({
  head: () => ({
    meta: [
      { title: "Instructions • Uboo" },
      {
        name: "description",
        content:
          "Tell Uboo how you want conversations to feel — tone, pace and personality, in your own words.",
      },
      { property: "og:title", content: "Instructions • Uboo" },
      {
        property: "og:description",
        content: "Teach your AI companion how to talk to you.",
      },
    ],
  }),
  component: Instructions,
});

const presets = ["Friendly", "Professional", "Casual", "Funny", "Calm", "Coach", "Custom"];

function Instructions() {
  const { instructions, personality, saveInstructions } = useUboo();
  const [text, setText] = useState(instructions);
  const [preset, setPreset] = useState(personality);

  return (
    <AppShell>
      <SectionTitle
        title="How should your AI talk to you?"
        subtitle="Uboo will follow this in every conversation"
      />

      <GlassCard className="mt-6 p-6">
        <div className="flex items-start gap-4">
          <Mascot state="idle" size={96} className="hidden shrink-0 sm:block" />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            aria-label="Instructions for your AI"
            placeholder="Tell your AI how you want conversations to feel..."
            className="w-full resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:italic placeholder:text-muted-foreground"
          />
        </div>
      </GlassCard>

      <h2 className="mt-8 text-sm font-semibold">Personality</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {presets.map((p) => (
          <Pill key={p} active={preset === p} onClick={() => setPreset(p)}>
            {p}
          </Pill>
        ))}
      </div>

      <GlassButton
        variant="primary"
        size="lg"
        className="mt-8 w-full sm:w-auto"
        onClick={() => {
          saveInstructions(text, preset);
          toast("Instructions saved");
        }}
      >
        Save instructions
      </GlassButton>
    </AppShell>
  );
}
