import { create } from "zustand";

type AppState = {
  counters: Record<string, number>;
  inc: (id: string, by?: number) => void;
  reset: (id: string) => void;

  notify: (msg: string) => string;
  // auth state
  isAuthenticated: boolean;
  userId?: string | null;
  setAuthenticated: (value: boolean, userId?: string | null) => void;
  logout: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  counters: {},
  inc: (id, by = 1) =>
    set((s) => ({ counters: { ...s.counters, [id]: (s.counters[id] ?? 0) + by } })),
  reset: (id) =>
    set((s) => {
      const next = { ...s.counters };
      delete next[id];
      return { counters: next };
    }),

    notify: (msg: string) =>  {
      console.log("Notification:", msg);
      return msg;
    }
    ,
    isAuthenticated: false,
    userId: null,
    setAuthenticated: (value: boolean, userId: string | null = null) => set({ isAuthenticated: value, userId }),
    logout: () => set({ isAuthenticated: false, userId: null }),
}));

export const selectCounter = (id: string) => (s: AppState) => s.counters[id] ?? 0;
