import { create } from "zustand";

type Module = {
  id: string;
  title: string;
  description: string;
  order: number;
  xpReward: number;
};

type LearningState = {
  modules: Module[];
  completed: Set<string>;
  currentModule: Module | null;

  loadModules: () => void;
  completeModule: (id: string) => void;
  progress: () => number;
};

const defaultModules: Module[] = [
  {
    id: "1",
    title: "Kenali Dirimu Sebagai Kreator",
    description:
      "Pahami kekuatanmu. Apakah kamu lebih jago ngomong, nulis, atau ngikutin tren? Mulai dari sini.",
    order: 1,
    xpReward: 25,
  },
  {
    id: "2",
    title: "Bikin Caption yang Bikin Klik",
    description:
      "Rahasia caption 3 detik: hook, manfaat, call-to-action. Template yang bisa langsung kamu pakai.",
    order: 2,
    xpReward: 25,
  },
  {
    id: "3",
    title: "Foto Produk Pakai HP Doang",
    description:
      "Nggak butuh kamera mahal. Lighting alami + angle yang bikin produkmu standout.",
    order: 3,
    xpReward: 25,
  },
  {
    id: "4",
    title: "Video Pendek = Cuan Panjang",
    description:
      "TikTok/Reels 30 detik: dari ide, rekam, sampe upload. Struktur yang bikin orang nonton sampai habis.",
    order: 4,
    xpReward: 25,
  },
  {
    id: "5",
    title: "Konsisten Itu Kuncinya",
    description:
      "Gimana caranya tetep bikin konten tiap hari tanpa burnout. Sistem, bukan motivasi.",
    order: 5,
    xpReward: 25,
  },
];

export const useLearningStore = create<LearningState>((set, get) => ({
  modules: [],
  completed: new Set(),
  currentModule: null,

  loadModules: () => set({ modules: defaultModules }),

  completeModule: (id) => {
    set((s) => ({
      completed: new Set([...s.completed, id]),
    }));
  },

  progress: () => {
    const { modules, completed } = get();
    if (modules.length === 0) return 0;
    return completed.size / modules.length;
  },
}));
