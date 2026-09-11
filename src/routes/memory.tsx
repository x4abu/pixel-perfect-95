import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/uboo/AppShell";
import { GlassCard, GlassButton, SectionTitle } from "@/components/uboo/Glass";
import { Pill } from "@/components/uboo/SettingsRow";
import { Switch } from "@/components/ui/switch";
import { useUboo, type MemoryCategory } from "@/lib/uboo-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/memory")({
  head: () => ({
    meta: [
      { title: "Memory • Uboo" },
      {
        name: "description",
        content:
          "See, edit and import everything your Uboo companion remembers about you — always under your control.",
      },
      { property: "og:title", content: "Memory • Uboo" },
      {
        property: "og:description",
        content: "Everything your AI companion remembers about you, under your control.",
      },
    ],
  }),
  component: MemoryScreen,
});

const categories: Array<MemoryCategory | "All"> = [
  "All",
  "Personal",
  "Preferences",
  "Important People",
  "Goals",
  "Conversation Context",
  "Custom",
];

function MemoryScreen() {
  const { memories, toggleMemory, deleteMemory, saveMemory, importMemory } = useUboo();
  const [filter, setFilter] = useState<MemoryCategory | "All">("All");
  const [sheet, setSheet] = useState<null | "add" | "import">(null);

  const list = useMemo(
    () => (filter === "All" ? memories : memories.filter((m) => m.category === filter)),
    [memories, filter],
  );

  return (
    <AppShell>
      <SectionTitle title="Memory" subtitle="What your AI remembers about you" />

      <div className="mt-5 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Pill key={c} active={filter === c} onClick={() => setFilter(c)}>
            {c}
          </Pill>
        ))}
      </div>

      <div className="mt-5 flex gap-3">
        <GlassButton variant="primary" onClick={() => setSheet("add")}>
          <Plus className="size-4" /> Add Memory
        </GlassButton>
        <GlassButton onClick={() => setSheet("import")}>
          <Upload className="size-4" /> Import Memory
        </GlassButton>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {list.map((m, i) => (
          <GlassCard
            key={m.id}
            className={cn("animate-enter p-5", !m.enabled && "opacity-60")}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{m.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {m.description}
                </p>
              </div>
              <Switch
                checked={m.enabled}
                onCheckedChange={() => toggleMemory(m.id)}
                aria-label={`Remember ${m.title}`}
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="rounded-full glass-tint px-3 py-1 text-[11px] font-medium">
                {m.category}
              </span>
              <span className="flex items-center gap-3 text-[11px] text-muted-foreground">
                {m.addedAt}
                <button
                  type="button"
                  aria-label={`Delete memory ${m.title}`}
                  onClick={() => {
                    deleteMemory(m.id);
                    toast("Memory removed");
                  }}
                  className="press text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </span>
            </div>
          </GlassCard>
        ))}
        {list.length === 0 && (
          <p className="col-span-full py-16 text-center text-sm italic text-muted-foreground">
            Nothing remembered here yet.
          </p>
        )}
      </div>

      {sheet && (
        <Sheet onClose={() => setSheet(null)}>
          {sheet === "add" ? (
            <AddMemory
              onSave={(title, description, category) => {
                saveMemory({ title, description, category });
                toast("Memory saved");
                setSheet(null);
              }}
            />
          ) : (
            <ImportMemory
              onImport={(items) => {
                importMemory(items);
                toast(`${items.length} memories imported`);
                setSheet(null);
              }}
            />
          )}
        </Sheet>
      )}
    </AppShell>
  );
}

function Sheet({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-end sm:place-items-center"
      style={{ background: "oklch(0.3 0.02 145 / 0.18)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="animate-pop glass-strong m-3 w-full max-w-lg rounded-4xl p-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="press glass float-right grid size-9 place-items-center rounded-full"
        >
          <X className="size-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

function AddMemory({
  onSave,
}: {
  onSave: (t: string, d: string, c: MemoryCategory) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<MemoryCategory>("Personal");

  return (
    <div>
      <h2 className="text-xl font-semibold">Add a memory</h2>
      <p className="mt-1 text-sm italic text-muted-foreground">
        Something you'd like Uboo to keep in mind.
      </p>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Memory title"
        aria-label="Memory title"
        className="glass mt-5 w-full rounded-2xl px-4 py-3 text-sm outline-none"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Short description"
        aria-label="Memory description"
        rows={3}
        className="glass mt-3 w-full resize-none rounded-2xl px-4 py-3 text-sm outline-none"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {(
          ["Personal", "Preferences", "Important People", "Goals", "Custom"] as MemoryCategory[]
        ).map((c) => (
          <Pill key={c} active={category === c} onClick={() => setCategory(c)}>
            {c}
          </Pill>
        ))}
      </div>
      <GlassButton
        variant="primary"
        className="mt-5 w-full"
        disabled={!title.trim()}
        onClick={() => onSave(title.trim(), description.trim(), category)}
      >
        Save memory
      </GlassButton>
    </div>
  );
}

function ImportMemory({
  onImport,
}: {
  onImport: (items: Array<{ title: string; description: string }>) => void;
}) {
  const [mode, setMode] = useState<"text" | "json" | "file">("text");
  const [value, setValue] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  const parsed = useMemo(() => {
    if (!value.trim()) return [];
    if (mode === "json") {
      try {
        const data = JSON.parse(value);
        if (Array.isArray(data)) {
          return data
            .map((d: unknown) =>
              typeof d === "string"
                ? { title: d, description: "Imported memory" }
                : {
                    title: String((d as { title?: string }).title ?? "Untitled"),
                    description: String(
                      (d as { description?: string }).description ?? "Imported memory",
                    ),
                  },
            )
            .slice(0, 50);
        }
      } catch {
        return [];
      }
      return [];
    }
    return value
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => ({ title: l.slice(0, 60), description: "Imported memory" }));
  }, [value, mode]);

  return (
    <div>
      <h2 className="text-xl font-semibold">Bring your existing memories</h2>
      <p className="mt-1 text-sm italic text-muted-foreground">
        Import information you want your AI companion to remember.
      </p>

      <div className="mt-4 flex gap-2">
        {(["text", "json", "file"] as const).map((m) => (
          <Pill key={m} active={mode === m} onClick={() => setMode(m)}>
            {m === "text" ? "From text" : m === "json" ? "From JSON" : "Memory file"}
          </Pill>
        ))}
      </div>

      {mode === "file" ? (
        <label className="glass mt-4 flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-dashed text-center text-sm text-muted-foreground">
          <Upload className="size-5" />
          {fileName ?? "Drag a .txt or .json file here, or browse"}
          <input
            type="file"
            accept=".txt,.json"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setFileName(f.name);
              setValue(await f.text());
            }}
          />
        </label>
      ) : (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={6}
          aria-label="Memories to import"
          placeholder={
            mode === "json"
              ? '[{ "title": "Loves chai", "description": "Two cups a day" }]'
              : "One memory per line…"
          }
          className="glass mt-4 w-full resize-none rounded-3xl px-4 py-3 text-sm outline-none"
        />
      )}

      <p className="mt-3 text-xs text-muted-foreground">
        {parsed.length} memories detected
        {parsed[0] ? ` • preview: “${parsed[0].title}”` : ""}
      </p>

      <GlassButton
        variant="primary"
        className="mt-4 w-full"
        disabled={parsed.length === 0}
        onClick={() => onImport(parsed)}
      >
        Import {parsed.length || ""} memories
      </GlassButton>
    </div>
  );
}
