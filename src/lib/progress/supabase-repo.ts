import "server-only";
import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { getAdminSupabase } from "@/lib/supabase/admin";
import {
  rowsToProgress,
  rowToPatternStat,
  rowToSubmission,
  type ActivityRow,
  type BadgeRow,
  type ConceptRow,
  type LevelClearRow,
  type PatternStatRow,
  type ProblemRow,
  type StatsRow,
  type SubmissionRow,
} from "./rows";
import { RevisionConflictError, type ProgressRepository } from "./service";

function check<T>(result: { data: T | null; error: PostgrestError | null }, what: string): T {
  if (result.error) throw new Error(`${what} 실패: ${result.error.message}`);
  if (result.data === null) throw new Error(`${what}: 데이터가 없어요`);
  return result.data;
}

/** 서비스 키로 진도를 읽고 RPC로 쓴다. 호출하는 쪽(Route Handler)이 사용자를 먼저 확인해야 한다 */
export function createSupabaseProgressRepo(client: SupabaseClient = getAdminSupabase()): ProgressRepository {
  async function rpc(name: string, args: Record<string, unknown>): Promise<number> {
    const { data, error } = await client.rpc(name, args);
    if (error) {
      if (error.code === "40001" || error.message.includes("revision_conflict")) throw new RevisionConflictError();
      throw new Error(`${name} 실패: ${error.message}`);
    }
    return Number(data);
  }

  return {
    async load(userId) {
      const [stats, activity, problems, concepts, levelClears, badges] = await Promise.all([
        client.from("user_stats").select("*").eq("user_id", userId).single<StatsRow>(),
        client.from("activity_days").select("*").eq("user_id", userId).returns<ActivityRow[]>(),
        client.from("problem_progress").select("*").eq("user_id", userId).returns<ProblemRow[]>(),
        client.from("concept_progress").select("*").eq("user_id", userId).returns<ConceptRow[]>(),
        client.from("level_clears").select("*").eq("user_id", userId).returns<LevelClearRow[]>(),
        client.from("user_badges").select("*").eq("user_id", userId).returns<BadgeRow[]>(),
      ]);
      const statsRow = check(stats, "통계 조회");
      const progress = rowsToProgress(userId, {
        stats: statsRow,
        activity: check(activity, "활동일 조회"),
        problems: check(problems, "문제 진도 조회"),
        concepts: check(concepts, "개념 진도 조회"),
        levelClears: check(levelClears, "레벨 클리어 조회"),
        badges: check(badges, "배지 조회"),
      });
      return { progress, revision: Number(statsRow.revision) };
    },
    recordSubmission: (userId, revision, submission, changes) =>
      rpc("record_submission", {
        p_user_id: userId,
        p_expected_revision: revision,
        p_submission: submission,
        p_changes: changes,
      }),
    recordConcept: (userId, revision, changes) =>
      rpc("record_concept_progress", { p_user_id: userId, p_expected_revision: revision, p_changes: changes }),
    recordProblemState: (userId, revision, changes) =>
      rpc("record_problem_state", { p_user_id: userId, p_expected_revision: revision, p_changes: changes }),
    mergeGuest: (userId, revision, changes, submissions: SubmissionRow[]) =>
      rpc("merge_guest_progress", {
        p_user_id: userId,
        p_expected_revision: revision,
        p_changes: changes,
        p_submissions: submissions,
      }),
    async listSubmissions(userId, limit) {
      const result = await client
        .from("submissions")
        .select(
          "id, problem_key, source, topic_slug, level, pattern_tags, language, code, verdict, passed, total, runtime_ms, hints_opened, created_at",
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit)
        .returns<(SubmissionRow & { id: string })[]>();
      return check(result, "제출 기록 조회").map(rowToSubmission);
    },
    async patternStats(userId) {
      const result = await client
        .from("user_pattern_stats")
        .select("*")
        .eq("user_id", userId)
        .returns<PatternStatRow[]>();
      return check(result, "패턴 통계 조회").map(rowToPatternStat);
    },
  };
}
