import "server-only";
import type { User } from "@supabase/supabase-js";
import { getProblem } from "@/content/problems";
import { getGeneratedStore } from "@/lib/ai/store";
import { toLocalDate } from "@/lib/date";
import type { AccountProfile } from "@/lib/progress/account";
import type { ProgressRepository } from "@/lib/progress/service";
import { createSupabaseProgressRepo } from "@/lib/progress/supabase-repo";
import { getAdminSupabase, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/supabase/server";
import type { Problem } from "@/types";

/** 진도 API 공통: 로그인 확인 → 저장소. 실패하면 바로 돌려줄 Response */
export async function requireAccount(): Promise<{ user: User; repo: ProgressRepository } | Response> {
  if (!isSupabaseAdminConfigured()) {
    return Response.json({ error: "계정 기능이 아직 설정되지 않았어요." }, { status: 503 });
  }
  const user = await getAuthUser();
  if (!user) return Response.json({ error: "로그인이 필요해요." }, { status: 401 });
  return { user, repo: createSupabaseProgressRepo() };
}

export function serverClock(now = new Date()) {
  return { today: toLocalDate(now), now: now.toISOString() };
}

/** 문제 키 → 문제 (AI 생성 문제는 본인 것 중 검증된 것만) */
export async function findProblemForUser(problemKey: string, userId: string): Promise<Problem | null> {
  if (problemKey.startsWith("c:")) return getProblem(problemKey.slice(2)) ?? null;
  const record = await getGeneratedStore().get(problemKey.slice(2));
  return record && record.ownerId === userId && record.status === "verified" ? record.problem : null;
}

interface ProfileRow {
  id: string;
  nickname: string;
  daily_goal_xp: number;
  theme: AccountProfile["theme"];
  editor_font_size: number;
  preferred_language: AccountProfile["preferredLanguage"];
  /** 20260926000003 마이그레이션 전에는 없다 */
  show_in_ranking?: boolean;
  created_at: string;
}

export async function loadProfile(user: User): Promise<AccountProfile> {
  const { data, error } = await getAdminSupabase().from("profiles").select("*").eq("id", user.id).single<ProfileRow>();
  if (error) throw new Error(`프로필 조회 실패: ${error.message}`);
  return {
    id: data.id,
    email: user.email ?? null,
    nickname: data.nickname,
    dailyGoalXp: data.daily_goal_xp,
    theme: data.theme,
    editorFontSize: data.editor_font_size,
    preferredLanguage: data.preferred_language,
    showInRanking: data.show_in_ranking ?? true,
    createdAt: new Date(data.created_at).toISOString(),
  };
}

export function badRequest(message = "요청 내용을 확인해 주세요.") {
  return Response.json({ error: message }, { status: 400 });
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}
