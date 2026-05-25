import { create } from "zustand";

type AffiliateLink = {
  id: string;
  productName: string;
  shortCode: string;
  url: string;
  clicks: number;
  conversions: number;
  commission: number;
  createdAt: number;
};

type AffiliateState = {
  links: AffiliateLink[];
  loading: boolean;

  generateLink: (productName: string) => Promise<AffiliateLink>;
  trackClick: (linkId: string) => void;
  loadLinks: () => void;
};

export const useAffiliateStore = create<AffiliateState>((set, get) => ({
  links: [],
  loading: false,

  generateLink: async (productName) => {
    set({ loading: true });
    await new Promise((r) => setTimeout(r, 500));
    const id = String(Date.now());
    const shortCode = Math.random().toString(36).slice(2, 8).toUpperCase();
    const link: AffiliateLink = {
      id,
      productName,
      shortCode,
      url: `https://creator.network/r/${shortCode}`,
      clicks: 0,
      conversions: 0,
      commission: 0,
      createdAt: Date.now(),
    };
    set({ links: [link, ...get().links], loading: false });
    return link;
  },

  trackClick: (linkId) =>
    set((s) => ({
      links: s.links.map((l) =>
        l.id === linkId ? { ...l, clicks: l.clicks + 1 } : l,
      ),
    })),

  loadLinks: () => {
    // TODO: Fetch from Supabase
  },
}));
