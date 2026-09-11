import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, PhoneOff, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { Atmosphere } from "@/components/uboo/AppShell";
import { GlassButton } from "@/components/uboo/Glass";
import { Mascot } from "@/components/uboo/Mascot";
import { MicrophoneButton } from "@/components/uboo/MicrophoneButton";
import { VoiceVisualizer } from "@/components/uboo/VoiceVisualizer";
import { stateLabel, useVoiceState } from "@/lib/use-voice-state";

export const Route = createFileRoute("/voice")({
  head: () => ({
    meta: [
      { title: "Live voice • Uboo" },
      {
        name: "description",
        content:
          "A full-screen live voice session with Uboo — speak naturally and watch your companion respond.",
      },
      { property: "og:title", content: "Live voice • Uboo" },
      {
        property: "og:description",
        content: "Full-screen live voice session with your AI companion.",
      },
    ],
  }),
  component: LiveVoice,
});

function LiveVoice() {
  const voice = useVoiceState("listening");
  const [muted, setMuted] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col">
      <Atmosphere />

      <header className="flex items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <GlassButton
          variant="glass"
          size="icon"
          aria-label="Back"
          onClick={() => navigate({ to: "/" })}
        >
          <ChevronLeft className="size-5" />
        </GlassButton>
        <div className="text-center">
          <p className="text-sm font-semibold">Late night thoughts</p>
          <p className="text-[11px] italic text-muted-foreground">AI Companion</p>
        </div>
        <span className="size-11" />
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6">
        <Mascot state={voice.state} amplitude={voice.amplitude} size={320} />
        <p className="text-lg italic text-muted-foreground">{stateLabel[voice.state]}</p>
        <VoiceVisualizer
          state={voice.state}
          amplitude={voice.amplitude}
          className="max-w-md"
        />
      </div>

      <footer className="flex items-center justify-center gap-5 px-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <GlassButton
          variant="glass"
          size="icon"
          aria-label={muted ? "Unmute Uboo" : "Mute Uboo"}
          onClick={() => setMuted((m) => !m)}
          className="size-14"
        >
          {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
        </GlassButton>

        <MicrophoneButton
          state={voice.state}
          amplitude={voice.amplitude}
          onToggle={voice.toggle}
          size={92}
        />

        <GlassButton
          variant="danger"
          size="icon"
          aria-label="End conversation"
          onClick={() => navigate({ to: "/" })}
          className="size-14"
        >
          <PhoneOff className="size-5" />
        </GlassButton>
      </footer>
    </div>
  );
}
