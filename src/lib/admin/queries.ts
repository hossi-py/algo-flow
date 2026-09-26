import "server-only";
import { getProblem } from "@/content/problems";
import { getTopic } from "@/content/topics";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { requireAdmin } from "./auth";

/**
 * 관리자 화면 데이터 (읽기 전용). 모든 함수가 먼저 관리자인지 확인하고(requireAdmin),
 * service role로 읽는다. 사용자 코드·코치 대화 내용은 가져오지 않는다.
 */

export const USER_SORTS = ["joined", "active", "xp", "solved", "email"] as const;
export type UserSort = (typeof USER_SORTS)[number];
export const USERS_PAGE_SIZE = 30;

export interface AdminUserRow {
  id: string;
  email: string;
  nickname: string;
  joinedAt: string;
  lastSignInAt: string | null;
  lastActiveDate: string | null;
  xp: number;
  currentStreak: number;
  solvedCount: number;
  submissionCount: number;
}

export async function listUsers(params: { search: string; sort: UserSort; page: number }) {
  await requireAdmin();
  const page = Math.max(1, params.page);
  const { data, error } = await getAdminSupabase().rpc("admin_list_users", {
    p_search: params.search.slice(0, 100),
    p_sort: params.sort,
    p_limit: USERS_PAGE_SIZE,
    p_offset: (page - 1) * USERS_PAGE_SIZE,
  });
  if (error) throw new Error(`회원 목록을 불러오지 못했어요: ${error.message}`);
  const rows = (data ?? []) as Record<string, unknown>[];
  const total = rows.length > 0 ? Number(rows[0]?.total_count) : 0;
  return {
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / USERS_PAGE_SIZE)),
    users: rows.map((row): AdminUserRow => ({
      id: String(row.id),
      email: String(row.email ?? ""),
      nickname: String(row.nickname ?? ""),
      joinedAt: String(row.joined_at),
      lastSignInAt: (row.last_sign_in_at as string | null) ?? null,
      lastActiveDate: (row.last_active_date as string | null) ?? null,
      xp: Number(row.xp ?? 0),
      currentStreak: Number(row.current_streak ?? 0),
      solvedCount: Number(row.solved_count ?? 0),
      submissionCount: Number(row.submission_count ?? 0),
    })),
  };
}

export interface AdminOverview {
  totals: {
    users: number;
    activeLast7Days: number;
    submissions: number;
    accepted: number;
    solvedProblems: number;
    generatedProblems: number;
    coachMessages: number;
  };
  daily: { day: string; signups: number; activeUsers: number; submissions: number; accepted: number }[];
}

export interface ErrorGroupRow {
  fingerprint: string;
  source: string;
  occurrences: number;
  firstSeen: string;
  lastSeen: string;
  message: string;
  path: string | null;
  release: string | null;
}

export async function getOverview(days = 14): Promise<{ overview: AdminOverview; errors: ErrorGroupRow[] }> {
  await requireAdmin();
  const supabase = getAdminSupabase();
  const [overview, errors] = await Promise.all([
    supabase.rpc("admin_overview", { p_days: days }),
    supabase.from("error_groups").select("*").order("last_seen", { ascending: false }).limit(15),
  ]);
  if (overview.error) throw new Error(`운영 현황을 불러오지 못했어요: ${overview.error.message}`);
  // 에러 기록은 없어도 화면은 보여 준다
  if (errors.error) console.warn("[admin] error_groups 조회 실패", errors.error.message);
  return {
    overview: overview.data as AdminOverview,
    errors: ((errors.data ?? []) as Record<string, unknown>[]).map((row) => ({
      fingerprint: String(row.fingerprint),
      source: String(row.source),
      occurrences: Number(row.occurrences),
      firstSeen: String(row.first_seen),
      lastSeen: String(row.last_seen),
      message: String(row.latest_message ?? ""),
      path: (row.latest_path as string | null) ?? null,
      release: (row.latest_release as string | null) ?? null,
    })),
  };
}

/** problem_key(c:slug · g:uuid)를 사람이 읽는 이름으로 */
export function problemLabel(problemKey: string): string {
  if (problemKey.startsWith("g:")) return "AI 맞춤 문제";
  const slug = problemKey.slice(2);
  return getProblem(slug)?.title ?? slug;
}

export interface AdminUserDetail {
  id: string;
  email: string;
  isAdmin: boolean;
  joinedAt: string;
  lastSignInAt: string | null;
  nickname: string;
  preferredLanguage: string;
  stats: { xp: number; currentStreak: number; longestStreak: number; lastActiveDate: string | null };
  topics: { slug: string; title: string; conceptDone: boolean; highestLevel: number; solved: number }[];
  recentSubmissions: {
    id: string;
    problem: string;
    topic: string;
    level: number;
    language: string;
    verdict: string;
    passed: number;
    total: number;
    hintsOpened: number;
    createdAt: string;
  }[];
  badges: { name: string; earnedAt: string }[];
  activity: { day: string; xp: number; solved: number }[];
  ai: { coachQuestions: number; generated: Record<string, number> };
}

export async function getUserDetail(userId: string): Promise<AdminUserDetail | null> {
  await requireAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(userId)) return null;
  const supabase = getAdminSupabase();
  const [account, profile, stats, clears, concepts, progress, submissions, badges, activity, coach, generated] =
    await Promise.all([
      supabase.rpc("admin_user_account", { p_user_id: userId }),
      supabase.from("profiles").select("nickname, preferred_language").eq("id", userId).maybeSingle(),
      supabase.from("user_stats").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("level_clears").select("topic_slug, level").eq("user_id", userId),
      supabase.from("concept_progress").select("topic_slug, completed_at").eq("user_id", userId),
      supabase.from("problem_progress").select("topic_slug, status").eq("user_id", userId).eq("status", "solved"),
      supabase
        .from("submissions")
        .select("id, problem_key, topic_slug, level, language, verdict, passed, total, hints_opened, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase.from("user_badges").select("earned_at, badges(name)").eq("user_id", userId).order("earned_at"),
      supabase
        .from("activity_days")
        .select("activity_date, xp_earned, solved_count")
        .eq("user_id", userId)
        .order("activity_date", { ascending: false })
        .limit(30),
      supabase
        .from("coach_messages")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("role", "user"),
      supabase.from("generated_problems").select("status").eq("owner_id", userId),
    ]);

  const accountRow = ((account.data ?? []) as Record<string, unknown>[])[0];
  if (account.error) throw new Error(`계정 정보를 불러오지 못했어요: ${account.error.message}`);
  if (!accountRow || !profile.data) return null;

  const clearsRows = (clears.data ?? []) as { topic_slug: string; level: number }[];
  const conceptRows = (concepts.data ?? []) as { topic_slug: string; completed_at: string | null }[];
  const solvedRows = (progress.data ?? []) as { topic_slug: string }[];
  const topicSlugs = new Set([
    ...clearsRows.map((r) => r.topic_slug),
    ...conceptRows.map((r) => r.topic_slug),
    ...solvedRows.map((r) => r.topic_slug),
  ]);

  const generatedCounts: Record<string, number> = {};
  for (const row of (generated.data ?? []) as { status: string }[]) {
    generatedCounts[row.status] = (generatedCounts[row.status] ?? 0) + 1;
  }

  const statsRow = stats.data as Record<string, unknown> | null;
  return {
    id: userId,
    email: String(accountRow.email ?? ""),
    isAdmin: Boolean(accountRow.is_admin),
    joinedAt: String(accountRow.joined_at),
    lastSignInAt: (accountRow.last_sign_in_at as string | null) ?? null,
    nickname: String(profile.data.nickname),
    preferredLanguage: String(profile.data.preferred_language),
    stats: {
      xp: Number(statsRow?.xp ?? 0),
      currentStreak: Number(statsRow?.current_streak ?? 0),
      longestStreak: Number(statsRow?.longest_streak ?? 0),
      lastActiveDate: (statsRow?.last_active_date as string | null) ?? null,
    },
    // 커리큘럼 순서대로
    topics: [...topicSlugs]
      .sort((a, b) => (getTopic(a)?.order ?? 99) - (getTopic(b)?.order ?? 99))
      .map((slug) => ({
        slug,
        title: getTopic(slug)?.title ?? slug,
        conceptDone: conceptRows.some((r) => r.topic_slug === slug && r.completed_at !== null),
        highestLevel: Math.max(0, ...clearsRows.filter((r) => r.topic_slug === slug).map((r) => r.level)),
        solved: solvedRows.filter((r) => r.topic_slug === slug).length,
      })),
    recentSubmissions: ((submissions.data ?? []) as Record<string, unknown>[]).map((row) => ({
      id: String(row.id),
      problem: problemLabel(String(row.problem_key)),
      topic: getTopic(String(row.topic_slug))?.title ?? String(row.topic_slug),
      level: Number(row.level),
      language: String(row.language),
      verdict: String(row.verdict),
      passed: Number(row.passed),
      total: Number(row.total),
      hintsOpened: Number(row.hints_opened),
      createdAt: String(row.created_at),
    })),
    badges: ((badges.data ?? []) as { earned_at: string; badges: { name: string } | { name: string }[] | null }[]).map(
      (row) => ({
        name: (Array.isArray(row.badges) ? row.badges[0]?.name : row.badges?.name) ?? "",
        earnedAt: row.earned_at,
      }),
    ),
    activity: ((activity.data ?? []) as { activity_date: string; xp_earned: number; solved_count: number }[]).map(
      (row) => ({ day: row.activity_date, xp: row.xp_earned, solved: row.solved_count }),
    ),
    ai: { coachQuestions: coach.count ?? 0, generated: generatedCounts },
  };
}
