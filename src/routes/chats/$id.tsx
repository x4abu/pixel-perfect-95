import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Play, Send } from "lucide-react";
import { AppShell } from "@/components/uboo/AppShell";
import { GlassCard, GlassButton } from "@/components/uboo/Glass";
import { MiniWave } from "@/components/uboo/VoiceVisualizer";
import { MicrophoneButton } from "@/components/uboo/MicrophoneButton";
import { useVoiceState } from "@/lib/use-voice-state";
import { useUboo } from "@/lib/uboo-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chats/$id")({
  head: () => ({
    meta: [
      { title: "Conversation • Uboo" },
      {
        name: "description",
        content: "Read and replay a voice conversation with your Uboo companion.",
      },
      { property: "og:title", content: "Conversation • Uboo" },
      {
        property: "og:description",
        content: "Read and replay a voice conversation with Uboo.",
      },
    ],
  }),
  component: ConversationDetail,
});

function ConversationDetail() {
  const { id } = useParams({ from: "/chats/$id" });
  const { conversations, sendMessage } = useUboo();
  const conversation = conversations.find((c) => c.id === id);
  const [draft, setDraft] = useState("");
  const [playing, setPlaying] = useState<string | null>(null);
  const voice = useVoiceState();

  if (!conversation) {
    return (
      <AppShell>
        <p className="py-24 text-center text-sm italic text-muted-foreground">
          This conversation is no longer here.
        </p>
      </AppShell>
    );
  }

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    sendMessage(conversation.id, text);
    setDraft("");
  };

  return (
    <AppShell>
      <header className="flex items-center gap-3">
        <Link to="/chats" aria-label="Back to conversations">
          <GlassButton size="icon" variant="glass">
            <ChevronLeft className="size-5" />
          </GlassButton>
        </Link>
        <div>
          <h1 className="text-xl font-semibold leading-tight">{conversation.title}</h1>
          <p className="text-[11px] italic text-muted-foreground">{conversation.when}</p>
        </div>
      </header>

      <div className="mt-6 space-y-4">
        {conversation.messages.map((m, i) => (
          <GlassCard
            key={m.id}
            tint={m.role === "user"}
            className={cn(
              "animate-enter max-w-[86%] p-4",
              m.role === "user" ? "ml-auto" : "mr-auto",
            )}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {m.role === "user" ? "You" : "Uboo"}
              </span>
              <span className="text-[11px] text-muted-foreground">{m.time}</span>
            </div>
            <p
              className={cn(
                "mt-1.5 text-sm leading-relaxed",
                m.role === "assistant" && "italic",
              )}
            >
              {m.text}
            </p>
            {m.voice && (
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Play voice message"
                  onClick={() => setPlaying(playing === m.id ? null : m.id)}
                  className="press grid size-8 place-items-center rounded-full bg-[var(--primary)] text-primary-foreground"
                >
                  <Play className="size-3.5 fill-current" strokeWidth={0} />
                </button>
                <MiniWave playing={playing === m.id} />
                <span className="text-[11px] text-muted-foreground">
                  0:0{m.duration ?? 4}
                </span>
              </div>
            )}
          </GlassCard>
        ))}
        {conversation.messages.length === 0 && (
          <p className="py-16 text-center text-sm italic text-muted-foreground">
            Say something to begin.
          </p>
        )}
      </div>

      <div className="glass-strong fixed inset-x-4 bottom-28 z-30 flex items-center gap-3 rounded-full p-2 pl-5 lg:bottom-8 lg:left-[280px] lg:right-10">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Tap to speak, or type…"
          aria-label="Message Uboo"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {draft.trim() ? (
          <GlassButton variant="primary" size="icon" aria-label="Send" onClick={submit}>
            <Send className="size-4" />
          </GlassButton>
        ) : (
          <MicrophoneButton
            state={voice.state}
            amplitude={voice.amplitude}
            onToggle={voice.toggle}
            size={44}
          />
        )}
      </div>
    </AppShell>
  );
}
