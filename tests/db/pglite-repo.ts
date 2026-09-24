import type { PGlite } from "@electric-sql/pglite";
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
} from "@/lib/progress/rows";
import { RevisionConflictError, type ProgressRepository } from "@/lib/progress/service";
import { as } from "./supabase-emulator";

/** 서버(service role)와 같은 권한으로 PGlite에 진도를 읽고 쓴다 — Supabase 저장소와 같은 SQL 경로 */
export function createPgliteRepo(db: PGlite): ProgressRepository {
  const service = <T>(run: () => Promise<T>) => as(db, { kind: "service" }, run);

  async function rpc(sql: string, params: unknown[]): Promise<number> {
    return service(async () => {
      try {
        const result = await db.query<{ revision: number | string }>(sql, params);
        return Number(result.rows[0]?.revision);
      } catch (error) {
        if (error instanceof Error && error.message.includes("revision_conflict")) throw new RevisionConflictError();
        throw error;
      }
    });
  }

  return {
    load: (userId) =>
      service(async () => {
        const one = async <T>(sql: string) => (await db.query<T>(sql, [userId])).rows;
        const [stats] = await one<StatsRow>(
          "select xp, current_streak, longest_streak, last_active_date::text as last_active_date, revision from public.user_stats where user_id = $1",
        );
        if (!stats) throw new Error("user_stats가 없어요");
        const progress = rowsToProgress(userId, {
          stats,
          activity: await one<ActivityRow>(
            "select activity_date::text as activity_date, xp_earned, solved_count from public.activity_days where user_id = $1",
          ),
          problems: await one<ProblemRow>("select * from public.problem_progress where user_id = $1"),
          concepts: await one<ConceptRow>("select * from public.concept_progress where user_id = $1"),
          levelClears: await one<LevelClearRow>("select * from public.level_clears where user_id = $1"),
          badges: await one<BadgeRow>("select * from public.user_badges where user_id = $1"),
        });
        return { progress, revision: Number(stats.revision) };
      }),
    recordSubmission: (userId, revision, submission, changes) =>
      rpc("select public.record_submission($1, $2, $3::jsonb, $4::jsonb) as revision", [
        userId,
        revision,
        JSON.stringify(submission),
        JSON.stringify(changes),
      ]),
    recordConcept: (userId, revision, changes) =>
      rpc("select public.record_concept_progress($1, $2, $3::jsonb) as revision", [
        userId,
        revision,
        JSON.stringify(changes),
      ]),
    recordProblemState: (userId, revision, changes) =>
      rpc("select public.record_problem_state($1, $2, $3::jsonb) as revision", [
        userId,
        revision,
        JSON.stringify(changes),
      ]),
    mergeGuest: (userId, revision, changes, submissions: SubmissionRow[]) =>
      rpc("select public.merge_guest_progress($1, $2, $3::jsonb, $4::jsonb) as revision", [
        userId,
        revision,
        JSON.stringify(changes),
        JSON.stringify(submissions),
      ]),
    listSubmissions: (userId, limit) =>
      service(async () =>
        (
          await db.query<SubmissionRow & { id: string }>(
            "select * from public.submissions where user_id = $1 order by created_at desc limit $2",
            [userId, limit],
          )
        ).rows.map(rowToSubmission),
      ),
    patternStats: (userId) =>
      // 뷰는 security_invoker라 사용자 권한으로 읽는다 (RLS 적용)
      as(db, { kind: "user", id: userId }, async () =>
        (await db.query<PatternStatRow>("select * from public.user_pattern_stats")).rows.map(rowToPatternStat),
      ),
  };
}
