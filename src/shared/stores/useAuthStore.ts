import { create } from "zustand";
import { supabase } from "../lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

type AuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;

  signIn: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  loading: true,

  signIn: async (phone) => {
    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: { channel: "sms" },
    });
    if (error) throw error;
  },

  verifyOtp: async (phone, token) => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });
    if (error) throw error;
    set({ session: data.session, user: data.session?.user ?? null });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null });
  },

  initialize: () => {
    set({ loading: true });
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, user: session?.user ?? null, loading: false });
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
  },
}));
