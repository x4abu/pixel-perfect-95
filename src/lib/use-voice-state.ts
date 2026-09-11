/**
 * Mock voice engine.
 *
 * Drives the mascot + visualizer through the demo state machine:
 * idle -> listening -> thinking -> speaking -> happy -> idle
 * Swap the timers for real speech recognition / TTS events later.
 */
import { useCallback, useEffect, useRef, useState } from "react";

export type VoiceState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "happy"
  | "confused"
  | "sleeping"
  | "error";

export const stateLabel: Record<VoiceState, string> = {
  idle: "Tap to talk",
  listening: "Listening…",
  thinking: "Thinking…",
  speaking: "Speaking…",
  happy: "Got it",
  confused: "I didn't catch that",
  sleeping: "Resting",
  error: "Something went quiet",
};

export function useVoiceState(initial: VoiceState = "idle") {
  const [state, setState] = useState<VoiceState>(initial);
  const [amplitude, setAmplitude] = useState(0);
  const timers = useRef<number[]>([]);
  const frame = useRef<number | null>(null);

  const clear = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  useEffect(() => () => clear(), [clear]);

  // Simulated audio amplitude (0..1) — replace with real analyser data.
  useEffect(() => {
    if (state !== "listening" && state !== "speaking") {
      setAmplitude(0);
      return;
    }
    let t = 0;
    const tick = () => {
      t += 0.06;
      const base = state === "listening" ? 0.55 : 0.72;
      const v =
        base *
        (0.45 +
          0.3 * Math.sin(t * 2.1) +
          0.2 * Math.sin(t * 5.3 + 1.2) +
          0.12 * Math.sin(t * 9.7));
      setAmplitude(Math.max(0.05, Math.min(1, Math.abs(v))));
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [state]);

  const startVoice = useCallback(() => {
    clear();
    setState("listening");
    timers.current.push(
      window.setTimeout(() => setState("thinking"), 3200),
      window.setTimeout(() => setState("speaking"), 5000),
      window.setTimeout(() => setState("happy"), 9200),
      window.setTimeout(() => setState("idle"), 10400),
    );
  }, [clear]);

  const stopVoice = useCallback(() => {
    clear();
    setState("idle");
  }, [clear]);

  const setManual = useCallback(
    (s: VoiceState) => {
      clear();
      setState(s);
    },
    [clear],
  );

  const toggle = useCallback(() => {
    if (state === "idle" || state === "sleeping" || state === "error") startVoice();
    else stopVoice();
  }, [state, startVoice, stopVoice]);

  const active = state === "listening" || state === "speaking" || state === "thinking";

  return { state, amplitude, active, startVoice, stopVoice, toggle, setManual };
}
