import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VoiceState } from "@/lib/use-voice-state";

export function MicrophoneButton({
  state,
  amplitude,
  onToggle,
  size = 84,
  className,
}: {
  state: VoiceState;
  amplitude: number;
  onToggle: () => void;
  size?: number;
  className?: string;
}) {
  const active = state === "listening" || state === "speaking" || state === "thinking";

  return (
    <div className={cn("relative grid place-items-center", className)}>
      {active && (
        <>
          <span
            className="pointer-events-none absolute rounded-full border border-[var(--glass-border)]"
            style={{
              width: size,
              height: size,
              animation: "uboo-ring 2.6s var(--ease-calm) infinite",
              background: "oklch(0.9 0.18 128 / 0.18)",
            }}
          />
          <span
            className="pointer-events-none absolute rounded-full"
            style={{
              width: size,
              height: size,
              transform: `scale(${1 + amplitude * 0.35})`,
              background: "oklch(0.9 0.18 128 / 0.22)",
              filter: "blur(10px)",
              transition: "transform 120ms linear",
            }}
          />
        </>
      )}
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={active}
        aria-label={active ? "Stop talking to Uboo" : "Start talking to Uboo"}
        className={cn(
          "press specular relative grid place-items-center rounded-full",
          active
            ? "bg-[var(--primary)] text-primary-foreground shadow-[var(--shadow-glow)]"
            : "glass-strong text-foreground",
        )}
        style={{ width: size, height: size }}
      >
        {active ? (
          <Square className="size-6 fill-current" strokeWidth={0} />
        ) : (
          <Mic className="size-7" strokeWidth={1.6} />
        )}
      </button>
    </div>
  );
}
