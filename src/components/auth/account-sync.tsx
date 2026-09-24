"use client";

import { useEffect, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import { useTheme } from "next-themes";
import type { AccountProfile } from "@/lib/progress/account";
import { hasProgress } from "@/lib/progress/merge";
import { fetchAccountSnapshot, mergeGuestProgress, patchProfile } from "@/lib/progress/remote";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { useAccountStore } from "@/stores/account-store";
import { useCoachStore } from "@/stores/coach-store";
import { useProgressStore } from "@/stores/progress-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useSubmissionLogStore } from "@/stores/submission-log-store";

const SETTINGS_SAVE_DELAY_MS = 800;

/** 게스트 화면에 다른 계정의 진도가 남지 않게 한다 (로그아웃·세션 만료) */
function ensureGuestProgress() {
  const store = useProgressStore.getState();
  if (store.progress.userId !== null) {
    store.reset();
    useCoachStore.setState({ threads: {} });
  }
}

type ProfileSettings = Pick<AccountProfile, "editorFontSize" | "preferredLanguage" | "dailyGoalXp" | "theme">;

/**
 * 로그인 상태를 지켜보다가
 * - 로그인: 이 브라우저에 게스트 진도가 있으면 계정으로 병합 → 서버 진도·프로필로 맞춤
 * - 로그아웃: 빈 게스트 진도로 되돌림
 * - 로그인 중 설정(글자 크기·언어·일일 목표·테마)을 바꾸면 프로필에 저장
 */
export function AccountSync() {
  const hydrated = useProgressStore((s) => s.hydrated);
  const { theme, setTheme } = useTheme();
  const setThemeRef = useRef(setTheme);
  const themeRef = useRef(theme);
  useEffect(() => {
    setThemeRef.current = setTheme;
    themeRef.current = theme;
  });

  // 세션 변화 → 진도 동기화
  useEffect(() => {
    if (!hydrated) return;
    const account = useAccountStore.getState();
    const supabase = getBrowserSupabase();
    if (!supabase) {
      account.set({ status: "disabled" });
      ensureGuestProgress();
      return;
    }

    let syncedUser: string | null = null;
    let cancelled = false;

    async function syncUser(user: User) {
      if (syncedUser === user.id) return;
      syncedUser = user.id;
      account.set({ status: "user", userId: user.id, email: user.email ?? null, syncing: true, syncError: null });
      try {
        const local = useProgressStore.getState().progress;
        let merged = false;
        if (local.userId === null && hasProgress(local)) {
          const result = await mergeGuestProgress({
            progress: local,
            submissions: useSubmissionLogStore.getState().entries,
          });
          // 바로 계정 진도로 바꿔 둔다 (뒤의 조회가 실패해도 다음에 같은 게스트 진도를 또 병합하지 않도록)
          useProgressStore.getState().replace(result.progress);
          useSubmissionLogStore.getState().clear();
          merged = true;
        }
        const snapshot = await fetchAccountSnapshot();
        if (cancelled) return;
        useProgressStore.getState().replace(snapshot.progress);

        const settings = useSettingsStore.getState();
        let profile = snapshot.profile;
        if (merged) {
          // 게스트로 쓰던 설정을 새 계정에 그대로 옮긴다
          const local: ProfileSettings = {
            editorFontSize: settings.editorFontSize,
            preferredLanguage: settings.language,
            dailyGoalXp: settings.dailyGoalXp,
            theme: (themeRef.current as ProfileSettings["theme"] | undefined) ?? profile.theme,
          };
          profile = (await patchProfile(local).catch(() => ({ profile }))).profile;
        } else {
          settings.setEditorFontSize(profile.editorFontSize);
          settings.setLanguage(profile.preferredLanguage);
          settings.setDailyGoalXp(profile.dailyGoalXp);
          setThemeRef.current(profile.theme);
        }
        account.set({ profile, syncing: false });
      } catch (error) {
        syncedUser = null;
        account.set({
          syncing: false,
          syncError: `계정 진도를 불러오지 못했어요. ${error instanceof Error ? error.message : ""}`.trim(),
        });
      }
    }

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      // 콜백 안에서 Supabase를 다시 부르면 잠금이 걸릴 수 있어 다음 틱으로 미룬다
      window.setTimeout(() => {
        if (cancelled) return;
        if (user) {
          void syncUser(user);
        } else {
          syncedUser = null;
          account.set({ status: "guest", userId: null, email: null, profile: null, syncing: false, syncError: null });
          ensureGuestProgress();
        }
      }, 0);
    });
    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, [hydrated]);

  // 로그인 중 설정 변경 → 프로필 저장 (잠시 모았다가 한 번에)
  useEffect(() => {
    let timer: number | undefined;
    const save = () => {
      const { status, profile, set } = useAccountStore.getState();
      if (status !== "user" || !profile) return;
      const settings = useSettingsStore.getState();
      const next: ProfileSettings = {
        editorFontSize: settings.editorFontSize,
        preferredLanguage: settings.language,
        dailyGoalXp: settings.dailyGoalXp,
        theme: (themeRef.current as ProfileSettings["theme"] | undefined) ?? profile.theme,
      };
      const changed = (Object.keys(next) as (keyof ProfileSettings)[]).filter((key) => next[key] !== profile[key]);
      if (changed.length === 0) return;
      void patchProfile(Object.fromEntries(changed.map((key) => [key, next[key]])))
        .then((result) => set({ profile: result.profile }))
        .catch(() => undefined);
    };
    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(save, SETTINGS_SAVE_DELAY_MS);
    };
    const unsubscribe = useSettingsStore.subscribe(schedule);
    schedule();
    return () => {
      unsubscribe();
      window.clearTimeout(timer);
    };
  }, [theme]);

  return null;
}
