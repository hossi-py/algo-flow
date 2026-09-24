import type { PGlite } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";
import { flowerZones } from "@/content/problems/dfs/flower-zones";
import { TOPICS } from "@/content/topics";
import { submitAction } from "@/lib/progress/actions";
import { submissionToRow } from "@/lib/progress/rows";
import {
  mergeGuestForUser,
  openHintForUser,
  RevisionConflictError,
  submitForUser,
  type ProgressRepository,
  type SubmissionPayload,
} from "@/lib/progress/service";
import { computePatternStats, topWeaknesses } from "@/lib/progress/weakness";
import { createEmptyProgress } from "@/stores/progress-store";
import type { PatternTag, Problem, UserProgress } from "@/types";
import { createPgliteRepo } from "./pglite-repo";
import { as, createSupabaseEmulator, signUp } from "./supabase-emulator";

const A = "00000000-0000-4000-8000-00000000000a";
const B = "00000000-0000-4000-8000-00000000000b";

let db: PGlite;
let repo: ProgressRepository;

const clock = (day: string, time = "09:00:00") => ({ today: day, now: `${day}T${time}.000Z` });

function payload(verdict: SubmissionPayload["verdict"], code = "def solution(g):\n    return []\n"): SubmissionPayload {
  return {
    verdict,
    passed: verdict === "accepted" ? 12 : 3,
    total: 12,
    runtimeMs: verdict === "accepted" ? 40 : null,
    language: "python",
    code,
    results: [],
  };
}

/** 패턴 태그만 다른 AI 생성 문제 (Lv2) */
function generated(id: string, patternTags: PatternTag[]): Problem {
  return { ...flowerZones, id: `g:${id}`, slug: id, source: "generated", level: 2, xp: 20, patternTags };
}

beforeAll(async () => {
  db = await createSupabaseEmulator();
  repo = createPgliteRepo(db);
  await signUp(db, A, "노디친구");
  await signUp(db, B);
  // 두 사용자 모두 데이터를 만든다
  await submitForUser(repo, A, flowerZones, payload("accepted"), TOPICS, clock("2026-09-20"));
  await submitForUser(repo, B, flowerZones, payload("wrong-answer"), TOPICS, clock("2026-09-20"));
  await as(db, { kind: "user", id: A }, () =>
    db.query(
      "insert into public.coach_messages (user_id, problem_key, role, content) values ($1, 'c:dfs-flower-zones', 'user', '안녕')",
      [A],
    ),
  );
}, 60_000);

describe("가입", () => {
  it("auth.users에 들어오면 프로필과 통계 행이 생긴다 (OAuth 이름을 닉네임으로)", async () => {
    const rows = await as(
      db,
      { kind: "service" },
      async () =>
        (await db.query<{ id: string; nickname: string }>("select id, nickname from public.profiles order by id")).rows,
    );
    expect(rows).toEqual([
      { id: A, nickname: "노디친구" },
      { id: B, nickname: "새싹 학습자" },
    ]);
  });
});

describe("RLS: 다른 사용자 데이터는 보이지 않는다", () => {
  const OWN_TABLES = [
    ["profiles", "id"],
    ["user_stats", "user_id"],
    ["activity_days", "user_id"],
    ["problem_progress", "user_id"],
    ["submissions", "user_id"],
    ["user_badges", "user_id"],
    ["coach_messages", "user_id"],
    ["concept_progress", "user_id"],
    ["level_clears", "user_id"],
    ["generated_problems", "owner_id"],
  ] as const;

  it.each(OWN_TABLES)("%s: 로그인 사용자는 자기 행만", async (table, column) => {
    const owners = await as(db, { kind: "user", id: B }, async () =>
      (await db.query<{ owner: string }>(`select ${column} as owner from public.${table}`)).rows.map((r) => r.owner),
    );
    expect(owners.every((owner) => owner === B)).toBe(true);
    const total = await as(db, { kind: "service" }, async () =>
      Number((await db.query<{ n: number }>(`select count(*) as n from public.${table}`)).rows[0]?.n),
    );
    // 서비스 권한으로는 A의 행도 있는 테이블이 있다 (그래도 B에게는 안 보였다)
    if (["profiles", "user_stats", "submissions", "problem_progress"].includes(table)) {
      expect(total).toBeGreaterThan(owners.length);
    }
  });

  it.each(OWN_TABLES)("%s: 로그인 안 한 사용자(anon)는 아무것도 못 본다", async (table) => {
    const rows = await as(db, { kind: "anon" }, async () => (await db.query(`select * from public.${table}`)).rows);
    expect(rows).toEqual([]);
  });

  it("배지 정의는 누구나 볼 수 있다", async () => {
    const rows = await as(db, { kind: "anon" }, async () => (await db.query("select id from public.badges")).rows);
    expect(rows).toHaveLength(9);
  });

  it("약점 분석 뷰도 자기 행만 (security_invoker)", async () => {
    const users = await as(db, { kind: "user", id: B }, async () =>
      (await db.query<{ user_id: string }>("select user_id from public.user_pattern_stats")).rows.map((r) => r.user_id),
    );
    expect(users.length).toBeGreaterThan(0);
    expect(users.every((id) => id === B)).toBe(true);
  });
});

describe("권한: 클라이언트 키로 쓸 수 없는 것", () => {
  it("AI 생성 문제의 정답 코드는 본인 문제여도 조회할 수 없다", async () => {
    const id = "11111111-1111-4111-8111-111111111111";
    await as(db, { kind: "service" }, async () => {
      await db.query(
        "insert into public.generated_problems (id, owner_id, status, topic_slug, level, request, model) values ($1, $2, 'verifying', 'dfs', 3, '{}', 'claude-opus-5')",
        [id, A],
      );
      await db.query("select public.complete_generated_problem($1, $2::jsonb, '[]'::jsonb, $3)", [
        id,
        JSON.stringify({ title: "다리", patternTags: ["connected-components"] }),
        "def solution():\n    return 42\n",
      ]);
    });
    // 문제 공개부는 볼 수 있지만
    const visible = await as(
      db,
      { kind: "user", id: A },
      async () =>
        (
          await db.query<{ status: string; pattern_tags: string[] }>(
            "select status, pattern_tags from public.generated_problems where id = $1",
            [id],
          )
        ).rows,
    );
    expect(visible).toEqual([{ status: "verified", pattern_tags: ["connected-components"] }]);
    // 정답 코드는 권한 자체가 없다
    await expect(
      as(db, { kind: "user", id: A }, () => db.query("select code from public.generated_problem_solutions")),
    ).rejects.toThrow(/permission denied/);
    await expect(
      as(db, { kind: "anon" }, () => db.query("select code from public.generated_problem_solutions")),
    ).rejects.toThrow(/permission denied/);
  });

  it("진도 기록 RPC는 service role만 실행할 수 있다", async () => {
    await expect(
      as(db, { kind: "user", id: A }, () =>
        db.query("select public.record_submission($1, 0, '{}'::jsonb, '{}'::jsonb)", [A]),
      ),
    ).rejects.toThrow(/permission denied/);
  });

  it("제출·통계를 직접 쓰거나 고칠 수 없다", async () => {
    await expect(
      as(db, { kind: "user", id: A }, () =>
        db.query(
          "insert into public.submissions (user_id, problem_key, source, topic_slug, level, code, verdict, passed, total) values ($1, 'c:x', 'curated', 'dfs', 3, 'x', 'accepted', 1, 1)",
          [A],
        ),
      ),
    ).rejects.toThrow(/row-level security/);
    const updated = await as(
      db,
      { kind: "user", id: A },
      async () => (await db.query("update public.user_stats set xp = 99999 where user_id = $1", [A])).affectedRows,
    );
    expect(updated).toBe(0);
    const { progress } = await repo.load(A);
    expect(progress.stats.xp).toBe(30);
  });

  it("프로필은 자기 설정 항목만 고칠 수 있다", async () => {
    const own = await as(
      db,
      { kind: "user", id: A },
      async () =>
        (await db.query("update public.profiles set nickname = '알고리즘러' where id = $1", [A])).affectedRows,
    );
    expect(own).toBe(1);
    const other = await as(
      db,
      { kind: "user", id: A },
      async () => (await db.query("update public.profiles set nickname = '해커' where id = $1", [B])).affectedRows,
    );
    expect(other).toBe(0);
    await expect(
      as(db, { kind: "user", id: A }, () =>
        db.query("update public.profiles set created_at = now() where id = $1", [A]),
      ),
    ).rejects.toThrow(/permission denied/);
  });

  it("코치 대화는 자기 이름으로만 남길 수 있다", async () => {
    await expect(
      as(db, { kind: "user", id: A }, () =>
        db.query(
          "insert into public.coach_messages (user_id, problem_key, role, content) values ($1, 'c:x', 'user', '가짜')",
          [B],
        ),
      ),
    ).rejects.toThrow(/row-level security/);
  });
});

describe("제출 1회 = 한 트랜잭션", () => {
  it("정답 제출이 제출 기록·문제 진도·XP·스트릭·활동일·배지를 함께 갱신한다", async () => {
    const { progress } = await repo.load(A);
    expect(progress.stats).toEqual({ xp: 30, currentStreak: 1, longestStreak: 1, lastActiveDate: "2026-09-20" });
    expect(progress.activity).toEqual([{ date: "2026-09-20", xpEarned: 30, solvedCount: 1 }]);
    expect(progress.problems["c:dfs-flower-zones"]).toMatchObject({
      status: "solved",
      attempts: 1,
      xpAwarded: 30,
      lastCode: "def solution(g):\n    return []\n",
      solvedAt: "2026-09-20T09:00:00.000Z",
    });
    expect(progress.badges.map((b) => b.badgeId).sort()).toEqual(["first-accept", "no-hint-lv3"]);
    const submissions = await repo.listSubmissions(A, 10);
    expect(submissions).toHaveLength(1);
    expect(submissions[0]).toMatchObject({
      verdict: "accepted",
      patternTags: ["connected-components", "grid-flood-fill"],
    });
  });

  it("revision이 맞지 않으면 아무것도 기록하지 않는다", async () => {
    const before = await repo.listSubmissions(B, 50);
    const row = submissionToRow({ ...before[0]!, code: "print(1)" });
    await expect(
      repo.recordSubmission(B, 999, row, { activity: [], problems: [], concepts: [], level_clears: [], badges: [] }),
    ).rejects.toBeInstanceOf(RevisionConflictError);
    expect(await repo.listSubmissions(B, 50)).toHaveLength(before.length);
  });

  it("변경 중 하나라도 제약을 어기면 제출 기록까지 모두 되돌린다", async () => {
    const { revision } = await repo.load(B);
    const before = await repo.listSubmissions(B, 50);
    const row = submissionToRow({ ...before[0]!, code: "print(1)" });
    await expect(
      repo.recordSubmission(B, revision, row, {
        stats: { xp: -5, current_streak: 0, longest_streak: 0, last_active_date: null },
        activity: [],
        problems: [],
        concepts: [],
        level_clears: [],
        badges: [],
      }),
    ).rejects.toThrow(/check constraint/);
    expect(await repo.listSubmissions(B, 50)).toHaveLength(before.length);
    expect((await repo.load(B)).revision).toBe(revision);
  });

  it("동시에 두 번 제출해도 (revision 충돌 → 다시 계산) 둘 다 반영된다", async () => {
    await Promise.all([
      submitForUser(repo, B, flowerZones, payload("wrong-answer"), TOPICS, clock("2026-09-21")),
      submitForUser(repo, B, flowerZones, payload("runtime-error"), TOPICS, clock("2026-09-21")),
    ]);
    const { progress } = await repo.load(B);
    expect(progress.problems["c:dfs-flower-zones"]?.attempts).toBe(3);
    expect(await repo.listSubmissions(B, 50)).toHaveLength(3);
  });

  it("5번째 도전 끝에 맞히면 끈기왕, 힌트를 열었으면 혼자서도 척척은 없다", async () => {
    await openHintForUser(repo, B, flowerZones, 1, "2026-09-22T00:00:00.000Z");
    await submitForUser(repo, B, flowerZones, payload("wrong-answer"), TOPICS, clock("2026-09-22"));
    const result = await submitForUser(
      repo,
      B,
      flowerZones,
      payload("accepted"),
      TOPICS,
      clock("2026-09-22", "10:00:00"),
    );
    expect(result.outcome.firstSolve).toBe(true);
    expect(result.earnedBadges.sort()).toEqual(["first-accept", "never-give-up"]);
    const { progress } = await repo.load(B);
    // 힌트 1을 열어서 30 × 0.95 = 28.5 → 29
    expect(progress.stats.xp).toBe(29);
    expect(progress.problems["c:dfs-flower-zones"]?.maxHintOpened).toBe(1);
  });
});

describe("게스트 → 계정 병합", () => {
  function guestWithThreeSolved(): { progress: UserProgress; problems: Problem[] } {
    const problems = [
      flowerZones,
      generated("aaaaaaaa-0000-4000-8000-000000000001", ["subset"]),
      generated("aaaaaaaa-0000-4000-8000-000000000002", ["permutation"]),
    ];
    let progress = createEmptyProgress();
    const days = ["2026-09-21", "2026-09-22", "2026-09-22"];
    problems.forEach((problem, i) => {
      progress = submitAction(
        progress,
        { problem, verdict: "accepted", runtimeMs: 10, ...clock(days[i]!, `1${i}:00:00`) },
        TOPICS,
      ).progress;
    });
    return { progress, problems };
  }

  it("게스트로 3문제 푼 뒤 로그인하면 XP·진도·스트릭·배지가 그대로 보존된다", async () => {
    const C = "00000000-0000-4000-8000-00000000000c";
    await signUp(db, C);
    const guest = guestWithThreeSolved();
    expect(guest.progress.stats).toMatchObject({ xp: 70, currentStreak: 2 });

    const merged = await mergeGuestForUser(repo, C, guest.progress, [], TOPICS, "2026-09-22T12:00:00.000Z");
    const { progress } = await repo.load(C);
    expect(progress.stats).toEqual({ xp: 70, currentStreak: 2, longestStreak: 2, lastActiveDate: "2026-09-22" });
    expect(Object.values(progress.problems).filter((p) => p?.status === "solved")).toHaveLength(3);
    expect(progress.activity).toEqual([
      { date: "2026-09-21", xpEarned: 30, solvedCount: 1 },
      { date: "2026-09-22", xpEarned: 40, solvedCount: 2 },
    ]);
    expect(progress.badges.map((b) => b.badgeId).sort()).toEqual(["ai-pioneer", "first-accept", "no-hint-lv3"]);
    expect(merged.stats.xp).toBe(progress.stats.xp);
  });

  it("계정에서 이미 푼 문제는 XP를 두 번 주지 않는다", async () => {
    const guest = guestWithThreeSolved();
    const before = await repo.load(A); // A는 꽃밭 구역을 이미 풀었다 (30XP)
    await mergeGuestForUser(repo, A, guest.progress, [], TOPICS, "2026-09-22T12:00:00.000Z");
    const { progress } = await repo.load(A);
    expect(progress.stats.xp).toBe(before.progress.stats.xp + 40);
    expect(progress.problems["c:dfs-flower-zones"]?.attempts).toBe(2);
  });
});

describe("약점 분석", () => {
  it("DB 뷰(user_pattern_stats)와 TS 계산이 같은 결과를 낸다 → Top3가 실제 제출과 일치", async () => {
    const D = "00000000-0000-4000-8000-00000000000d";
    await signUp(db, D);
    const bfs1 = generated("bbbbbbbb-0000-4000-8000-000000000001", ["shortest-path-unweighted", "grid-shortest-path"]);
    const bfs2 = generated("bbbbbbbb-0000-4000-8000-000000000002", ["shortest-path-unweighted"]);
    const stack1 = generated("bbbbbbbb-0000-4000-8000-000000000003", ["bracket-matching"]);
    const stack2 = generated("bbbbbbbb-0000-4000-8000-000000000004", ["bracket-matching"]);
    const script: [Problem, SubmissionPayload["verdict"], number][] = [
      [bfs1, "wrong-answer", 0],
      [bfs1, "wrong-answer", 2],
      [bfs1, "accepted", 3],
      [bfs2, "time-limit-exceeded", 0],
      [stack1, "accepted", 0],
      [stack2, "wrong-answer", 0],
      [stack2, "accepted", 0],
    ];
    let minute = 0;
    for (const [problem, verdict, hints] of script) {
      for (let step = 1; step <= hints; step += 1) {
        await openHintForUser(repo, D, problem, step as 1 | 2 | 3 | 4, "2026-09-23T00:00:00.000Z");
      }
      minute += 1;
      await submitForUser(
        repo,
        D,
        problem,
        payload(verdict),
        TOPICS,
        clock("2026-09-23", `10:${String(minute).padStart(2, "0")}:00`),
      );
    }

    const fromView = await repo.patternStats(D);
    const fromTs = computePatternStats(await repo.listSubmissions(D, 100));
    expect(fromView.sort((a, b) => a.pattern.localeCompare(b.pattern))).toEqual(fromTs);

    const top = topWeaknesses(fromView);
    expect(top.map((w) => w.pattern)).toEqual(["shortest-path-unweighted", "bracket-matching"]);
    // BFS 최단 거리: 2문제 중 1개 해결, 정답은 힌트 3단계에서, 제출 4번 중 1번 정답
    expect(top[0]?.score).toBeCloseTo(0.5 * 0.5 + 0.3 * (3 / 4) + 0.2 * (1 - 1 / 4), 3);
    expect(top[0]?.reasons[0]).toContain("2개 중 1개 해결");
    // 문제가 1개뿐인 격자 최단 거리는 판단하지 않는다
    expect(top.map((w) => w.pattern)).not.toContain("grid-shortest-path");
  });
});
