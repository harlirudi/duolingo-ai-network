import { create } from "zustand";

type Product = {
  id: string;
  name: string;
  type: "physical" | "digital";
  description: string;
  price: number;
  reason: string;
  confidence: number;
};

type ProductState = {
  recommendations: Product[];
  loading: boolean;

  loadRecommendations: () => void;
  acceptProduct: (id: string) => void;
};

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Suplemen Stamina Pro",
    type: "physical",
    description: "Bantu konsumen yang aktif dan butuh energi ekstra seharian.",
    price: 300000,
    reason: "Networkmu banyak pekerja kantoran — mereka butuh stamina!",
    confidence: 0.85,
  },
  {
    id: "2",
    name: "Susu Kambing Ecer Premium",
    type: "physical",
    description: "Target ibu-ibu arisan yang peduli kesehatan keluarga.",
    price: 300000,
    reason: "Komunitas arisanmu peduli kesehatan anak.",
    confidence: 0.78,
  },
];

export const useProductStore = create<ProductState>((set) => ({
  recommendations: [],
  loading: false,

  loadRecommendations: () => {
    set({ loading: true });
    setTimeout(() => {
      set({ recommendations: sampleProducts, loading: false });
    }, 800);
  },

  acceptProduct: (id) =>
    set((s) => ({
      recommendations: s.recommendations.map((p) =>
        p.id === id ? { ...p, confidence: 1 } : p,
      ),
    })),
}));
