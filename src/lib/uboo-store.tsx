/**
 * Uboo front-end state.
 *
 * All data here is local/mock. Every mutation goes through a named action so a
 * real backend (Laravel API + Google AI SDK) can replace the bodies later
 * without touching any component.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type MemoryCategory =
  | "Personal"
  | "Preferences"
  | "Important People"
  | "Goals"
  | "Conversation Context"
  | "Custom";

export type Memory = {
  id: string;
  title: string;
  description: string;
  category: MemoryCategory;
  addedAt: string;
  enabled: boolean;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
  voice?: boolean | undefined;
  duration?: number | undefined;
};

export type Conversation = {
  id: string;
  title: string;
  when: string;
  preview: string;
  messages: Message[];
};

export type Settings = {
  accent: "lime" | "mint" | "sage";
  animationIntensity: number;
  voice: "Aria" | "Kai" | "Nova";
  speakingSpeed: number;
  volume: number;
  autoplay: boolean;
  interrupt: boolean;
  autoListen: boolean;
  transcripts: boolean;
  memoryEnabled: boolean;
  autoSaveMemories: boolean;
  keepHistory: boolean;
  storeVoiceData: boolean;
};

export type Profile = { name: string; tagline: string };

type State = {
  profile: Profile;
  conversations: Conversation[];
  memories: Memory[];
  instructions: string;
  personality: string;
  settings: Settings;
  onboarded: boolean;
};

const now = () => new Date().toISOString();

const uid = () => Math.random().toString(36).slice(2, 10);

const initialState: State = {
  profile: { name: "Abu", tagline: "Your AI companion" },
  conversations: [
    {
      id: "c1",
      title: "Late night thoughts",
      when: "Today • 8:42 PM",
      preview: "We talked about slowing down and sleeping earlier.",
      messages: [
        {
          id: "m1",
          role: "user",
          text: "I can't switch my brain off tonight.",
          time: "8:42 PM",
          voice: true,
          duration: 4,
        },
        {
          id: "m2",
          role: "assistant",
          text: "That's okay. Let's put the loud thoughts somewhere safe first — what's the loudest one?",
          time: "8:42 PM",
          voice: true,
          duration: 6,
        },
        {
          id: "m3",
          role: "user",
          text: "Mostly the project deadline on Friday.",
          time: "8:43 PM",
        },
        {
          id: "m4",
          role: "assistant",
          text: "Then we only plan Friday tonight. Everything else can wait until morning.",
          time: "8:43 PM",
          voice: true,
          duration: 5,
        },
      ],
    },
    {
      id: "c2",
      title: "Study planning",
      when: "Yesterday • 6:18 PM",
      preview: "Built a three-week revision plan with short sessions.",
      messages: [
        {
          id: "m1",
          role: "user",
          text: "Help me plan revision for three weeks.",
          time: "6:18 PM",
          voice: true,
          duration: 3,
        },
        {
          id: "m2",
          role: "assistant",
          text: "Short sessions, twice a day, one rest day a week. I'll keep the pace honest.",
          time: "6:18 PM",
          voice: true,
          duration: 7,
        },
      ],
    },
    {
      id: "c3",
      title: "Random questions",
      when: "Monday • 10:04 PM",
      preview: "Why is the sky that colour at dusk, and other detours.",
      messages: [
        {
          id: "m1",
          role: "user",
          text: "Why does dusk look green sometimes?",
          time: "10:04 PM",
        },
        {
          id: "m2",
          role: "assistant",
          text: "Light bends through more atmosphere, and your eyes fill in the rest. Pretty, isn't it?",
          time: "10:05 PM",
          voice: true,
          duration: 5,
        },
      ],
    },
  ],
  memories: [
    {
      id: "mm1",
      title: "Prefers concise answers",
      description: "Keeps replies short unless depth is requested.",
      category: "Preferences",
      addedAt: "12 Aug 2026",
      enabled: true,
    },
    {
      id: "mm2",
      title: "Interested in technology",
      description: "Enjoys product design, AI and building things.",
      category: "Personal",
      addedAt: "12 Aug 2026",
      enabled: true,
    },
    {
      id: "mm3",
      title: "Likes casual conversations",
      description: "Prefers a friendly tone, light Hinglish is welcome.",
      category: "Preferences",
      addedAt: "19 Aug 2026",
      enabled: true,
    },
    {
      id: "mm4",
      title: "Currently working on a project",
      description: "A voice companion product, deadline this Friday.",
      category: "Goals",
      addedAt: "2 Sep 2026",
      enabled: true,
    },
    {
      id: "mm5",
      title: "Sister studies medicine",
      description: "Mentions her often, exams in November.",
      category: "Important People",
      addedAt: "5 Sep 2026",
      enabled: false,
    },
  ],
  instructions:
    "Talk casually.\nKeep answers concise.\nUse Hinglish when appropriate.\nDon't sound robotic.",
  personality: "Friendly",
  settings: {
    accent: "lime",
    animationIntensity: 70,
    voice: "Aria",
    speakingSpeed: 50,
    volume: 65,
    autoplay: true,
    interrupt: true,
    autoListen: false,
    transcripts: true,
    memoryEnabled: true,
    autoSaveMemories: true,
    keepHistory: true,
    storeVoiceData: false,
  },
  onboarded: false,
};

const STORAGE_KEY = "uboo.state.v1";

type Store = State & {
  hydrated: boolean;
  saveInstructions: (text: string, personality: string) => void;
  saveMemory: (m: Omit<Memory, "id" | "addedAt" | "enabled">) => void;
  importMemory: (items: Array<{ title: string; description: string }>) => void;
  toggleMemory: (id: string) => void;
  deleteMemory: (id: string) => void;
  clearMemories: () => void;
  sendMessage: (conversationId: string, text: string, voice?: boolean) => void;
  startConversation: () => string;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  updateProfile: (p: Partial<Profile>) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
};

const UbooContext = createContext<Store | null>(null);

const replies = [
  "Got it. Want me to keep that in memory?",
  "Makes sense — let's take it one step at a time.",
  "I'm listening. Tell me more whenever you're ready.",
  "Noted. Should we plan the next bit together?",
];

export function UbooProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as State) });
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable */
    }
  }, [state, hydrated]);

  const patch = useCallback((fn: (s: State) => State) => setState(fn), []);

  const value = useMemo<Store>(
    () => ({
      ...state,
      hydrated,
      saveInstructions: (instructions, personality) =>
        patch((s) => ({ ...s, instructions, personality })),
      saveMemory: (m) =>
        patch((s) => ({
          ...s,
          memories: [
            {
              ...m,
              id: uid(),
              enabled: true,
              addedAt: new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
            },
            ...s.memories,
          ],
        })),
      importMemory: (items) =>
        patch((s) => ({
          ...s,
          memories: [
            ...items.map((i) => ({
              id: uid(),
              title: i.title,
              description: i.description,
              category: "Custom" as MemoryCategory,
              enabled: true,
              addedAt: new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
            })),
            ...s.memories,
          ],
        })),
      toggleMemory: (id) =>
        patch((s) => ({
          ...s,
          memories: s.memories.map((m) =>
            m.id === id ? { ...m, enabled: !m.enabled } : m,
          ),
        })),
      deleteMemory: (id) =>
        patch((s) => ({ ...s, memories: s.memories.filter((m) => m.id !== id) })),
      clearMemories: () => patch((s) => ({ ...s, memories: [] })),
      sendMessage: (conversationId, text, voice) => {
        const time = new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        });
        patch((s) => ({
          ...s,
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  preview: text,
                  when: `Today • ${time}`,
                  messages: [
                    ...c.messages,
                    { id: uid(), role: "user", text, time, voice },
                  ],
                }
              : c,
          ),
        }));
        // Mock assistant reply — replace with a real API call later.
        window.setTimeout(() => {
          patch((s) => ({
            ...s,
            conversations: s.conversations.map((c) =>
              c.id === conversationId
                ? {
                    ...c,
                    messages: [
                      ...c.messages,
                      {
                        id: uid(),
                        role: "assistant",
                        text: replies[Math.floor(Math.random() * replies.length)] ?? replies[0]!,
                        time,
                        voice: true,
                        duration: 4,
                      },
                    ],
                  }
                : c,
            ),
          }));
        }, 1400);
      },
      startConversation: () => {
        const id = uid();
        patch((s) => ({
          ...s,
          conversations: [
            {
              id,
              title: "New conversation",
              when: `Today • ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`,
              preview: "Say hello to start.",
              messages: [],
            },
            ...s.conversations,
          ],
        }));
        return id;
      },
      updateSetting: (key, val) =>
        patch((s) => ({ ...s, settings: { ...s.settings, [key]: val } })),
      updateProfile: (p) => patch((s) => ({ ...s, profile: { ...s.profile, ...p } })),
      completeOnboarding: () => patch((s) => ({ ...s, onboarded: true })),
      resetOnboarding: () => patch((s) => ({ ...s, onboarded: false })),
    }),
    [state, hydrated, patch],
  );

  return <UbooContext.Provider value={value}>{children}</UbooContext.Provider>;
}

export function useUboo() {
  const ctx = useContext(UbooContext);
  if (!ctx) throw new Error("useUboo must be used inside <UbooProvider>");
  return ctx;
}

export const createdAt = now;
