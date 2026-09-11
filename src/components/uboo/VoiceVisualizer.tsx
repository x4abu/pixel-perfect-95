import { cn } from "@/lib/utils";
import type { VoiceState } from "@/lib/use-voice-state";

/**
 * Organic liquid voice visualization — flowing waves, not an equalizer.
 */
export function VoiceVisualizer({
  state,
  amplitude,
  className,
}: {
  state: VoiceState;
  amplitude: number;
  className?: string;
}) {
  const active = state === "listening" || state === "speaking";
  const a = active ? amplitude : 0.04;

  const wave = (offset: number, mult: number) => {
    const h = 26 * a * mult;
    const pts: string[] = [];
    for (let x = 0; x <= 320; x += 8) {
      const y =
        30 +
        Math.sin(x / 34 + offset) * h * 0.6 +
        Math.sin(x / 13 + offset * 1.7) * h * 0.35;
      pts.push(`${x},${y.toFixed(2)}`);
    }
    return `M0,30 L${pts.join(" L")} L320,30`;
  };

  return (
    <div className={cn("relative w-full", className)} aria-hidden>
      <svg viewBox="0 0 320 60" className="h-16 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="uboo-wave" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.9 0.2 128)" stopOpacity="0.15" />
            <stop offset="50%" stopColor="oklch(0.82 0.2 130)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="oklch(0.9 0.2 128)" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <path
          d={wave(0, 1)}
          fill="none"
          stroke="url(#uboo-wave)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ transition: "d 90ms linear" }}
        />
        <path
          d={wave(1.9, 0.6)}
          fill="none"
          stroke="url(#uboo-wave)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d={wave(3.6, 0.35)}
          fill="none"
          stroke="url(#uboo-wave)"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.35"
        />
      </svg>
    </div>
  );
}

export function MiniWave({ playing = false }: { playing?: boolean }) {
  const bars = [7, 12, 18, 10, 15, 8, 13, 6, 11, 16, 9, 5];
  return (
    <div className="flex h-5 items-center gap-[3px]" aria-hidden>
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-[var(--deep)]/60"
          style={{
            height: h,
            animation: playing
              ? `uboo-breathe ${0.7 + (i % 4) * 0.16}s ease-in-out ${i * 0.05}s infinite`
              : undefined,
          }}
        />
      ))}
    </div>
  );
}
