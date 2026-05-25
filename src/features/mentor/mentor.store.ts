import { create } from "zustand";

type Mentor = {
  id: string;
  name: string;
  archetype: string;
  xp: number;
  mentees: number;
};

type MentorState = {
  mentors: Mentor[];
  myMentor: Mentor | null;
  myMentees: Mentor[];

  loadMentors: () => void;
  adoptMentor: (id: string) => void;
  addMentee: (mentee: Mentor) => void;
};

const sampleMentors: Mentor[] = [
  { id: "1", name: "Budi S.", archetype: "Trust Anchor", xp: 12400, mentees: 4 },
  { id: "2", name: "Siti A.", archetype: "Natural Seller", xp: 10200, mentees: 3 },
  { id: "3", name: "Dewi R.", archetype: "Silent Builder", xp: 7500, mentees: 2 },
  { id: "4", name: "Rudi H.", archetype: "Trend Hunter", xp: 6800, mentees: 1 },
];

export const useMentorStore = create<MentorState>((set) => ({
  mentors: [],
  myMentor: null,
  myMentees: [],

  loadMentors: () => set({ mentors: sampleMentors }),

  adoptMentor: (id) => {
    const mentor = sampleMentors.find((m) => m.id === id);
    if (mentor) set({ myMentor: mentor });
  },

  addMentee: (mentee) =>
    set((s) => ({ myMentees: [...s.myMentees, mentee] })),
}));
