/**
 * Zustand store for switching between public website and admin dashboard views.
 * Also stores mock auth state.
 *
 * NOTE: We intentionally do NOT use `persist` middleware here to avoid
 * Next.js hydration mismatches between server and client renders.
 * On a page reload, the user lands on the public site (which is the
 * desired behavior anyway).
 */
import { create } from "zustand";

type View = "public" | "admin";

interface AuthUser {
  email: string;
  name: string;
  role: string;
}

interface AppState {
  view: View;
  authed: boolean;
  user: AuthUser | null;
  setView: (v: View) => void;
  login: (u: AuthUser) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  view: "public",
  authed: false,
  user: null,
  setView: (v) => set({ view: v }),
  login: (u) => set({ authed: true, user: u, view: "admin" }),
  logout: () => set({ authed: false, user: null, view: "public" }),
}));
