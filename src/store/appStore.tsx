import { create } from "zustand";
import { createUiSlice, type UiSlice } from "./storeParts/uiSlice";
import { createAuthSlice, type AuthSlice } from "./storeParts/authSlice";

export type AppState = UiSlice & AuthSlice;

export const useAppStore = create<AppState>()((set, get, api) => ({
  ...createUiSlice(set, get, api),
  ...createAuthSlice(set, get, api),
}));

export const selectCounter = (id: string) => (s: AppState) => s.counters[id] ?? 0;
export const selectAuth = (s: AppState) => ({ isAuthenticated: s.isAuthenticated, userLogin: s.userLogin });
export const selectAccessToken = (s: AppState) => s.accessToken;
