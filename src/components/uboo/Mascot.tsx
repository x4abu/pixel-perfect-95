import { cn } from "@/lib/utils";
import type { VoiceState } from "@/lib/use-voice-state";

/**
 * Uboo — the companion. Pure SVG/CSS so every state can animate.
 */
export function Mascot({
  state = "idle",
  amplitude = 0,
  size = 220,
  className,
}: {
  state?: VoiceState;
  amplitude?: number;
  size?: number;
  className?: string;
}) {
  const sleeping = state === "sleeping";
  const listening = state === "listening";
  const speaking = state === "speaking";
  const thinking = state === "thinking";
  const happy = state === "happy";
  const confused = state === "confused";
  const error = state === "error";

  const eyeH = sleeping ? 1.6 : listening ? 15 : confused ? 9 : happy ? 6 : 12;
  const mouthScale = speaking ? 1 + amplitude * 0.9 : 1;
  const glow = listening || speaking ? 0.55 + amplitude * 0.4 : thinking ? 0.4 : 0.18;

  const bodyAnim = happy
    ? "uboo-bounce 0.9s var(--ease-spring)"
    : sleeping
      ? "uboo-breathe 6s ease-in-out infinite"
      : "uboo-float 6s ease-in-out infinite";

  return (
    <div
      className={cn("relative select-none", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Uboo, ${state}`}
    >
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full blur-2xl transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(circle at 50% 55%, oklch(0.9 0.19 128 / 0.75), transparent 62%)",
          opacity: glow,
        }}
      />

      {/* liquid rings */}
      {(listening || speaking) && (
        <>
          <Ring delay="0s" />
          <Ring delay="1.1s" />
          <Ring delay="2.2s" />
        </>
      )}

      {/* thinking orbit */}
      {thinking && (
        <div
          className="absolute inset-0"
          style={{ animation: "uboo-orbit 3.6s linear infinite" }}
        >
          {[0, 120, 240].map((deg) => (
            <span
              key={deg}
              className="absolute left-1/2 top-1/2 block h-2 w-2 rounded-full bg-[var(--deep)]"
              style={{
                transform: `rotate(${deg}deg) translateX(${size * 0.42}px)`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      )}

      {/* ambient particles */}
      {!sleeping &&
        [
          { x: "12%", y: "22%", d: "0s", s: 6 },
          { x: "84%", y: "30%", d: "1.4s", s: 4 },
          { x: "72%", y: "80%", d: "2.6s", s: 5 },
        ].map((p) => (
          <span
            key={p.d}
            className="absolute rounded-full bg-[var(--primary)]/60"
            style={{
              left: p.x,
              top: p.y,
              width: p.s,
              height: p.s,
              animation: `uboo-float 5s ease-in-out ${p.d} infinite`,
            }}
          />
        ))}

      <div
        className="absolute inset-0 grid place-items-center"
        style={{
          animation: bodyAnim,
          transformOrigin: "50% 60%",
        }}
      >
        <div
          style={{
            animation: confused
              ? "uboo-tilt 1.6s ease-in-out infinite"
              : "uboo-breathe 4.2s ease-in-out infinite",
            transform: listening ? "translateY(6px) scale(1.03)" : undefined,
            transition: "transform 0.6s var(--ease-spring)",
          }}
        >
          <svg width={size * 0.78} height={size * 0.78} viewBox="0 0 200 200" fill="none">
            <defs>
              <radialGradient id="uboo-body" cx="38%" cy="28%" r="82%">
                <stop offset="0%" stopColor="oklch(1 0 0)" />
                <stop offset="58%" stopColor="oklch(0.97 0.03 128)" />
                <stop offset="100%" stopColor="oklch(0.9 0.08 132)" />
              </radialGradient>
              <linearGradient id="uboo-accent" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="oklch(0.9 0.2 128)" />
                <stop offset="100%" stopColor="oklch(0.76 0.18 135)" />
              </linearGradient>
              <filter id="uboo-shadow" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow
                  dx="0"
                  dy="10"
                  stdDeviation="12"
                  floodColor="oklch(0.55 0.1 135)"
                  floodOpacity="0.18"
                />
              </filter>
            </defs>

            {/* antenna */}
            <path
              d="M100 44 C100 30 104 24 112 18"
              stroke="url(#uboo-accent)"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.9"
            />
            <circle cx="113" cy="16" r="7" fill="url(#uboo-accent)">
              {!sleeping && (
                <animate
                  attributeName="r"
                  values="6.4;8;6.4"
                  dur="2.6s"
                  repeatCount="indefinite"
                />
              )}
            </circle>

            {/* ears */}
            <ellipse cx="34" cy="108" rx="12" ry="20" fill="url(#uboo-body)" opacity="0.9" />
            <ellipse cx="166" cy="108" rx="12" ry="20" fill="url(#uboo-body)" opacity="0.9" />

            {/* body */}
            <path
              filter="url(#uboo-shadow)"
              fill="url(#uboo-body)"
              stroke="oklch(1 0 0 / 0.85)"
              strokeWidth="2"
              d="M100 42c34 0 58 22 58 58 0 38-24 60-58 60s-58-22-58-60c0-36 24-58 58-58z"
            />

            {/* visor */}
            <path
              d="M56 92c0-20 20-32 44-32s44 12 44 32c0 22-20 34-44 34s-44-12-44-34z"
              fill="oklch(0.28 0.03 145 / 0.9)"
            />
            <path
              d="M62 82c6-12 22-19 38-19s32 7 38 19c-10-6-24-9-38-9s-28 3-38 9z"
              fill="oklch(1 0 0 / 0.22)"
            />

            {/* eyes */}
            <g fill="oklch(0.95 0.16 128)">
              <rect
                x={81 - (listening ? 2 : 0)}
                y={96 - eyeH / 2}
                width={listening ? 11 : 9}
                height={eyeH}
                rx={5}
              >
                {!sleeping && !listening && (
                  <animate
                    attributeName="height"
                    values={`${eyeH};${eyeH};1.5;${eyeH}`}
                    keyTimes="0;0.9;0.95;1"
                    dur="5.5s"
                    repeatCount="indefinite"
                  />
                )}
              </rect>
              <rect
                x={110}
                y={96 - (confused ? eyeH * 0.6 : eyeH) / 2}
                width={listening ? 11 : 9}
                height={confused ? eyeH * 0.6 : eyeH}
                rx={5}
              >
                {!sleeping && !listening && (
                  <animate
                    attributeName="height"
                    values={`${eyeH};${eyeH};1.5;${eyeH}`}
                    keyTimes="0;0.9;0.95;1"
                    dur="5.5s"
                    repeatCount="indefinite"
                  />
                )}
              </rect>
            </g>

            {/* mouth / voice */}
            <g transform={`translate(100 116) scale(${mouthScale}) translate(-100 -116)`}>
              {speaking ? (
                <rect x="90" y="110" width="20" height="12" rx="6" fill="oklch(0.9 0.2 128)" />
              ) : happy ? (
                <path
                  d="M90 113c4 6 16 6 20 0"
                  stroke="oklch(0.9 0.2 128)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : (
                <rect
                  x="93"
                  y="113"
                  width="14"
                  height="4"
                  rx="2"
                  fill="oklch(0.9 0.2 128 / 0.7)"
                />
              )}
            </g>

            {/* belly light */}
            <ellipse
              cx="100"
              cy="146"
              rx="24"
              ry="8"
              fill={error ? "oklch(0.8 0.13 70)" : "url(#uboo-accent)"}
              opacity={sleeping ? 0.2 : 0.45 + amplitude * 0.4}
            />
          </svg>
        </div>
      </div>

      {sleeping && (
        <span className="absolute right-2 top-4 text-sm italic text-muted-foreground">
          z z z
        </span>
      )}
    </div>
  );
}

function Ring({ delay }: { delay: string }) {
  return (
    <span
      className="pointer-events-none absolute inset-0 rounded-full border border-[var(--glass-border)]"
      style={{
        background:
          "radial-gradient(circle, transparent 58%, oklch(0.9 0.16 128 / 0.16) 100%)",
        animation: `uboo-ring 3.3s var(--ease-calm) ${delay} infinite`,
      }}
    />
  );
}
