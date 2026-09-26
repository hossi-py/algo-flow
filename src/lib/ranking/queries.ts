import "server-only";
import { getAdminSupabase, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/supabase/server";
import { seoulToday, untilReset, weekRange } from "./week";

export const RANKING_SIZE = 50;

export interface RankingEntry {
  rank: number;
  nickname: string;
  xp: number;
  solved: number;
  isMe: boolean;
}

export interface WeeklyRanking {
  /** Supabase가 없으면 랭킹을 만들 수 없다 (게스트 전용 모드) */
  available: boolean;
  weekStart: string;
  weekEnd: string;
  participants: number;
  entries: RankingEntry[];
  /** 로그인했고 이번 주 순위에 있으면 내 행 (상위 밖이어도) */
  me: RankingEntry | null;
  signedIn: boolean;
  /** 로그인했지만 랭킹 숨기기를 켰는지 */
  hidden: boolean;
  /** 다음 주 월요일 0시까지 */
  resetIn: { days: number; hours: number };
}

/**
 * 이번 주 랭킹. 순위 계산·제외(숨김·이상 기록)는 DB 함수(weekly_ranking)가 하고,
 * 서버는 닉네임·XP만 넘긴다 (회원 ID는 브라우저로 보내지 않는다).
 */
export async function getWeeklyRanking(now = new Date()): Promise<WeeklyRanking> {
  const range = weekRange(seoulToday(now));
  const empty: WeeklyRanking = {
    available: false,
    weekStart: range.start,
    weekEnd: range.end,
    participants: 0,
    entries: [],
    me: null,
    signedIn: false,
    hidden: false,
    resetIn: untilReset(now),
  };
  if (!isSupabaseAdminConfigured()) return empty;

  const user = await getAuthUser();
  const supabase = getAdminSupabase();
  const [ranking, profile] = await Promise.all([
    supabase.rpc("weekly_ranking", { p_user_id: user?.id ?? null, p_limit: RANKING_SIZE }),
    user
      ? supabase.from("profiles").select("show_in_ranking").eq("id", user.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  if (ranking.error) {
    console.warn("[ranking] 조회 실패", ranking.error.message);
    return { ...empty, signedIn: Boolean(user) };
  }
  const rows = (ranking.data ?? []) as Record<string, unknown>[];
  const entries = rows.map((row): RankingEntry => ({
    rank: Number(row.rank),
    nickname: String(row.nickname),
    xp: Number(row.xp),
    solved: Number(row.solved),
    isMe: Boolean(row.is_me),
  }));
  const me = entries.find((entry) => entry.isMe) ?? null;
  return {
    available: true,
    weekStart: range.start,
    weekEnd: range.end,
    participants: rows.length > 0 ? Number(rows[0]?.participants) : 0,
    entries: entries.filter((entry) => entry.rank <= RANKING_SIZE),
    me,
    signedIn: Boolean(user),
    hidden: (profile.data as { show_in_ranking?: boolean } | null)?.show_in_ranking === false,
    resetIn: empty.resetIn,
  };
}
