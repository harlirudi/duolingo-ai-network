import { create } from "zustand";
import type { Archetype } from "../onboarding/onboarding.store";

type ContentState = {
  archetype: Archetype | null;
  generating: boolean;
  lastCaption: string | null;
  history: Array<{ id: string; caption: string; timestamp: number }>;

  generateCaption: (prompt: string) => Promise<string>;
  setArchetype: (type: Archetype | null) => void;
};

const archetypeTones: Record<string, string> = {
  silent_builder: "Gaya edukatif, thoughtful, dan terstruktur. Pakai bullet points dan penjelasan singkat.",
  natural_seller: "Gaya energetik, persuasif, dan ramah. Pakai call-to-action yang kuat dan bahasa yang mengajak.",
  trend_hunter: "Gaya catchy, trendy, dan pendek. Pakai hook yang bikin penasaran dan bahasa kekinian.",
  trust_anchor: "Gaya hangat, trustworthy, dan personal. Pakai storytelling dan pengalaman pribadi.",
};

export const useContentStore = create<ContentState>((set, get) => ({
  archetype: null,
  generating: false,
  lastCaption: null,
  history: [],

  generateCaption: async (prompt) => {
    set({ generating: true });
    try {
      const tone = get().archetype
        ? archetypeTones[get().archetype!]
        : "Gaya casual dan friendly.";
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/caption-gen`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ prompt, tone }),
        },
      );
      const result = await response.json();
      if (!result.ok) throw new Error(result.error?.message ?? "Gagal generate");
      const caption = result.data.caption;
      const id = String(Date.now());
      set({
        lastCaption: caption,
        history: [{ id, caption, timestamp: Date.now() }, ...get().history].slice(0, 50),
      });
      return caption;
    } catch {
      const fallback = `✨ ${prompt}\n\nDapatkan sekarang! Link di bio. 🛒`;
      set({ lastCaption: fallback });
      return fallback;
    } finally {
      set({ generating: false });
    }
  },

  setArchetype: (type) => set({ archetype: type }),
}));
