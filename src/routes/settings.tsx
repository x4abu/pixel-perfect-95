import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/uboo/AppShell";
import { SectionTitle } from "@/components/uboo/Glass";
import { SettingsGroup, SettingsRow, Pill } from "@/components/uboo/SettingsRow";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useUboo } from "@/lib/uboo-store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings • Uboo" },
      {
        name: "description",
        content:
          "Tune Uboo's voice, animation, conversation behaviour, memory and privacy controls.",
      },
      { property: "og:title", content: "Settings • Uboo" },
      { property: "og:description", content: "Tune voice, memory and privacy for Uboo." },
    ],
  }),
  component: SettingsScreen,
});

function SettingsScreen() {
  const { settings, updateSetting, clearMemories } = useUboo();
  const s = settings;

  return (
    <AppShell>
      <SectionTitle title="Settings" subtitle="Make Uboo feel like yours" />

      <div className="mt-6 space-y-6">
        <SettingsGroup title="Appearance">
          <SettingsRow
            label="Accent"
            control={
              <span className="flex gap-2">
                {(["lime", "mint", "sage"] as const).map((a) => (
                  <Pill
                    key={a}
                    active={s.accent === a}
                    onClick={() => updateSetting("accent", a)}
                  >
                    {a}
                  </Pill>
                ))}
              </span>
            }
          />
          <SettingsRow
            label="Animation intensity"
            description={`${s.animationIntensity}%`}
            control={
              <Slider
                value={[s.animationIntensity]}
                onValueChange={([v]) => updateSetting("animationIntensity", v ?? 0)}
                className="w-36"
                aria-label="Animation intensity"
              />
            }
          />
        </SettingsGroup>

        <SettingsGroup title="Voice">
          <SettingsRow
            label="Voice"
            control={
              <span className="flex gap-2">
                {(["Aria", "Kai", "Nova"] as const).map((v) => (
                  <Pill key={v} active={s.voice === v} onClick={() => updateSetting("voice", v)}>
                    {v}
                  </Pill>
                ))}
              </span>
            }
          />
          <SettingsRow
            label="Speaking speed"
            control={
              <Slider
                value={[s.speakingSpeed]}
                onValueChange={([v]) => updateSetting("speakingSpeed", v ?? 0)}
                className="w-36"
                aria-label="Speaking speed"
              />
            }
          />
          <SettingsRow
            label="Voice volume"
            control={
              <Slider
                value={[s.volume]}
                onValueChange={([v]) => updateSetting("volume", v ?? 0)}
                className="w-36"
                aria-label="Voice volume"
              />
            }
          />
          <Toggle
            label="Auto-play responses"
            checked={s.autoplay}
            onChange={(v) => updateSetting("autoplay", v)}
          />
        </SettingsGroup>

        <SettingsGroup title="Conversation">
          <Toggle
            label="Interrupt AI while speaking"
            checked={s.interrupt}
            onChange={(v) => updateSetting("interrupt", v)}
          />
          <Toggle
            label="Auto-listen"
            description="Start listening after Uboo replies"
            checked={s.autoListen}
            onChange={(v) => updateSetting("autoListen", v)}
          />
          <Toggle
            label="Show transcripts"
            checked={s.transcripts}
            onChange={(v) => updateSetting("transcripts", v)}
          />
        </SettingsGroup>

        <SettingsGroup title="Memory">
          <Toggle
            label="Memory enabled"
            checked={s.memoryEnabled}
            onChange={(v) => updateSetting("memoryEnabled", v)}
          />
          <Toggle
            label="Automatically save memories"
            checked={s.autoSaveMemories}
            onChange={(v) => updateSetting("autoSaveMemories", v)}
          />
          <SettingsRow
            label="Clear all memories"
            danger
            onClick={() => {
              clearMemories();
              toast("All memories cleared");
            }}
          />
        </SettingsGroup>

        <SettingsGroup title="Privacy">
          <Toggle
            label="Keep conversation history"
            checked={s.keepHistory}
            onChange={(v) => updateSetting("keepHistory", v)}
          />
          <Toggle
            label="Store voice data"
            checked={s.storeVoiceData}
            onChange={(v) => updateSetting("storeVoiceData", v)}
          />
        </SettingsGroup>

        <SettingsGroup title="About">
          <SettingsRow label="Version" description="Uboo 1.0 • preview build" />
          <SettingsRow label="Terms of use" chevron onClick={() => undefined} />
          <SettingsRow label="Privacy policy" chevron onClick={() => undefined} />
        </SettingsGroup>
      </div>
    </AppShell>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <SettingsRow
      label={label}
      {...(description ? { description } : {})}
      control={<Switch checked={checked} onCheckedChange={onChange} aria-label={label} />}
    />
  );
}
