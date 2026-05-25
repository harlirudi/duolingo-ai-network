import { create } from "zustand";

export type Archetype =
  | "silent_builder"
  | "natural_seller"
  | "trend_hunter"
  | "trust_anchor";

type Message = {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: number;
};

type OnboardingState = {
  step: number;
  archetype: Archetype | null;
  confidence: number | null;
  messages: Message[];
  answers: Record<number, string>;
  loading: boolean;
  error: string | null;

  addMessage: (msg: Omit<Message, "id" | "timestamp">) => void;
  setAnswer: (questionIndex: number, answer: string) => void;
  setArchetype: (type: Archetype, confidence: number) => void;
  setLoading: (loading: boolean) => void;
  nextStep: () => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

const questions = [
  {
    id: 1,
    ai: "Halo! Aku KreaTori, AI Coach-mu. Sebelum kita mulai, ceritain dulu — apa goal utamamu di bisnis ini?",
  },
  {
    id: 2,
    ai: "Keren! Sekarang bayangin — kamu lagi promosi. Kamu lebih suka ngomong langsung di depan kamera, atau nulis caption yang dipikirin dulu?",
  },
  {
    id: 3,
    ai: "Waktu lagi cari ide konten, kamu biasanya ikutin tren yang lagi viral, atau bikin sesuatu yang edukatif dan timeless?",
  },
  {
    id: 4,
    ai: "Terakhir — berapa banyak waktu yang bisa kamu sisihin setiap hari buat bikin konten?",
  },
] as const;

const archetypeDescriptions: Record<
  Archetype,
  { title: string; emoji: string; color: string; description: string }
> = {
  silent_builder: {
    title: "Silent Builder",
    emoji: "🔵",
    color: "#1CB0F6",
    description:
      "Kamu kreator yang teliti. Lebih suka bikin konten tulisan dan desain yang dipikirin matang-matang. Carousel, caption, dan ebook adalah senjatamu.",
  },
  natural_seller: {
    title: "Natural Seller",
    emoji: "🟠",
    color: "#FF9600",
    description:
      "Kamu jago ngomong dan punya energi natural di depan kamera. Video talking-head, live selling, dan story personal adalah kekuatanmu.",
  },
  trend_hunter: {
    title: "Trend Hunter",
    emoji: "🟣",
    color: "#CE82FF",
    description:
      "Kamu selalu up-to-date! Gesit ngikutin tren, jago remix konten viral, dan bisa bikin sesuatu jadi rame dalam hitungan jam.",
  },
  trust_anchor: {
    title: "Trust Anchor",
    emoji: "🟡",
    color: "#FFD700",
    description:
      "Kamu punya network kuat dan dipercaya banyak orang. Fokusmu adalah membangun hubungan, mentoring, dan closing — bukan bikin konten sendirian.",
  },
};

export const useOnboarding = create<OnboardingState>((set, get) => ({
  step: 0,
  archetype: null,
  confidence: null,
  messages: [
    {
      id: "0",
      role: "ai",
      content: questions[0].ai,
      timestamp: Date.now(),
    },
  ],
  answers: {},
  loading: false,
  error: null,

  addMessage: (msg) =>
    set((s) => ({
      messages: [
        ...s.messages,
        { ...msg, id: String(s.messages.length), timestamp: Date.now() },
      ],
    })),

  setAnswer: (qi, answer) =>
    set((s) => ({ answers: { ...s.answers, [qi]: answer } })),

  setArchetype: (type, confidence) => set({ archetype: type, confidence }),

  setLoading: (loading) => set({ loading }),

  nextStep: () => {
    const { step, messages } = get();
    const next = step + 1;
    if (next < questions.length) {
      set({
        step: next,
        messages: [
          ...messages,
          {
            id: String(messages.length),
            role: "ai",
            content: questions[next].ai,
            timestamp: Date.now(),
          },
        ],
      });
    }
  },

  setError: (error) => set({ error }),

  reset: () =>
    set({
      step: 0,
      archetype: null,
      confidence: null,
      messages: [
        {
          id: "0",
          role: "ai",
          content: questions[0].ai,
          timestamp: Date.now(),
        },
      ],
      answers: {},
      loading: false,
      error: null,
    }),
}));

export function determineArchetype(
  answers: Record<number, string>,
): { type: Archetype; confidence: number } {
  const text = Object.values(answers).join(" ").toLowerCase();

  const scores: Record<Archetype, number> = {
    silent_builder: 0,
    natural_seller: 0,
    trend_hunter: 0,
    trust_anchor: 0,
  };

  if (/nulis|caption|tulisan|desain|carousel|dipikirin/i.test(text))
    scores.silent_builder += 2;
  if (
    /kamera|video|ngomong|live|lisan|depan orang|talking/i.test(text)
  )
    scores.natural_seller += 2;
  if (/viral|tren|ikutin|remix|cepet|rame/i.test(text))
    scores.trend_hunter += 2;
  if (
    /network|hubungan|mentor|closing|dipercaya|komunitas/i.test(
      text,
    )
  )
    scores.trust_anchor += 2;

  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) {
    return { type: "natural_seller" as Archetype, confidence: 0.3 };
  }
  const entry = Object.entries(scores).find(
    ([, v]) => v === maxScore,
  ) as [Archetype, number];

  return {
    type: entry[0],
    confidence: Math.min(maxScore / 6, 1),
  };
}

export { questions, archetypeDescriptions };
