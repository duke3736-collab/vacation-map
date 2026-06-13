import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  signInWithProvider: (provider: "kakao" | "google") => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),

  signInWithProvider: async (provider) => {
    if (!supabase) return;
    // 소셜 로그인 리다이렉트
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        // 카카오: 비즈니스 인증 없이 사용 가능한 스코프만 요청
        scopes: provider === "kakao" ? "profile_nickname profile_image" : undefined,
      },
    });
  },

  signOut: async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    set({ user: null });
  },

  initializeAuth: () => {
    if (!supabase) {
      set({ isLoading: false });
      return;
    }

    // 초기 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ user: session?.user ?? null, isLoading: false });
    });

    // 인증 상태 변경 구독
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null, isLoading: false });
    });
  },
}));
