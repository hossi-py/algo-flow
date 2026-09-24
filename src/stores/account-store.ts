"use client";

import { create } from "zustand";
import type { AccountProfile } from "@/lib/progress/account";

/**
 * 로그인 상태.
 * - disabled: Supabase 설정이 없어 게스트 모드만
 * - loading: 세션 확인 중
 * - guest / user
 */
export type AccountStatus = "disabled" | "loading" | "guest" | "user";

interface AccountState {
  status: AccountStatus;
  userId: string | null;
  email: string | null;
  profile: AccountProfile | null;
  /** 진도를 서버와 맞추는 중 (로그인 직후 병합 포함) */
  syncing: boolean;
  /** 마지막 동기화 오류 (화면에 안내) */
  syncError: string | null;
  set: (patch: Partial<Omit<AccountState, "set">>) => void;
}

export const useAccountStore = create<AccountState>()((set) => ({
  status: "loading",
  userId: null,
  email: null,
  profile: null,
  syncing: false,
  syncError: null,
  set: (patch) => set(patch),
}));
