import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getAdminSupabase } from "@/lib/supabase/admin";
import type { GeneratedProblem, GenerationRequest, LevelNumber, Problem, VerificationAttempt } from "@/types";
import { UUID_PATTERN, type GeneratedProblemStore } from "./types";

interface GeneratedRow {
  id: string;
  owner_id: string;
  status: GeneratedProblem["status"];
  topic_slug: string;
  level: number;
  request: GenerationRequest;
  problem: Problem | null;
  attempts: VerificationAttempt[];
  model: string;
  error: string | null;
  created_at: string;
  verified_at: string | null;
}

const COLUMNS =
  "id, owner_id, status, topic_slug, level, request, problem, attempts, model, error, created_at, verified_at";

function toRecord(row: GeneratedRow): GeneratedProblem {
  return {
    id: row.id,
    ownerId: row.owner_id,
    status: row.status,
    request: { ...row.request, level: row.level as Exclude<LevelNumber, 1> },
    problem: row.problem,
    attempts: row.attempts,
    model: row.model,
    error: row.error,
    createdAt: new Date(row.created_at).toISOString(),
    verifiedAt: row.verified_at ? new Date(row.verified_at).toISOString() : null,
  };
}

/**
 * Supabase 저장소 (서비스 키). 정답 코드는 complete_generated_problem RPC로 generated_problem_solutions에만 쓰고,
 * 이 저장소에는 그 테이블을 읽는 코드가 없다.
 */
export function createSupabaseStore(client: SupabaseClient = getAdminSupabase()): GeneratedProblemStore {
  const fail = (what: string, message: string) => new Error(`${what} 실패: ${message}`);
  return {
    async create(record) {
      const { error } = await client.from("generated_problems").insert({
        id: record.id,
        owner_id: record.ownerId,
        status: record.status,
        topic_slug: record.request.topic,
        level: record.request.level,
        request: record.request,
        pattern_tags: record.request.focusPatterns,
        attempts: record.attempts,
        model: record.model,
        created_at: record.createdAt,
      });
      if (error) throw fail("생성 문제 저장", error.message);
    },
    async update(id, patch) {
      const { error } = await client.from("generated_problems").update(patch).eq("id", id);
      if (error) throw fail("생성 문제 갱신", error.message);
    },
    async complete(id, result, solution) {
      const { error } = await client.rpc("complete_generated_problem", {
        p_id: id,
        p_problem: result.problem,
        p_attempts: result.attempts,
        p_solution: solution,
      });
      if (error) throw fail("검증 완료 저장", error.message);
    },
    async get(id) {
      if (!UUID_PATTERN.test(id)) return null;
      const { data, error } = await client
        .from("generated_problems")
        .select(COLUMNS)
        .eq("id", id)
        .maybeSingle<GeneratedRow>();
      if (error) throw fail("생성 문제 조회", error.message);
      return data ? toRecord(data) : null;
    },
    async listByOwner(ownerId, limit) {
      if (!UUID_PATTERN.test(ownerId)) return [];
      const { data, error } = await client
        .from("generated_problems")
        .select(COLUMNS)
        .eq("owner_id", ownerId)
        .order("created_at", { ascending: false })
        .limit(limit)
        .returns<GeneratedRow[]>();
      if (error) throw fail("생성 문제 목록", error.message);
      return (data ?? []).map(toRecord);
    },
    async countSince(ownerId, since) {
      if (!UUID_PATTERN.test(ownerId)) return 0;
      const { count, error } = await client
        .from("generated_problems")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", ownerId)
        .gte("created_at", since.toISOString());
      if (error) throw fail("생성 수 조회", error.message);
      return count ?? 0;
    },
  };
}
