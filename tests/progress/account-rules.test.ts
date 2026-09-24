import { describe, expect, it } from "vitest";
import { flowerZones } from "@/content/problems/dfs/flower-zones";
import { TOPICS } from "@/content/topics";
import { safeNextPath } from "@/lib/auth-redirect";
import { submitAction } from "@/lib/progress/actions";
import { mergeBodySchema } from "@/lib/progress/api-schemas";
import { awardBadges } from "@/lib/progress/badges";
import { mergeProgress, streaksFromActivity } from "@/lib/progress/merge";
import { aiLabHrefForPatterns } from "@/lib/progress/recommend";
import { isEmptyChanges, progressChanges } from "@/lib/progress/rows";
import { computePatternStats, weaknessScores } from "@/lib/progress/weakness";
import { createDemoProgress, createEmptyProgress } from "@/stores/progress-store";
import type { Problem, SubmissionSummary, UserProgress } from "@/types";

const at = (day: string) => ({ today: day, now: `${day}T10:00:00.000Z` });
const generated = (id: string): Problem => ({
  ...flowerZones,
  id: `g:${id}`,
  slug: id,
  source: "generated",
  level: 2,
  xp: 20,
});

describe("배지", () => {
  it("첫 정답·힌트 없이 Lv3·AI 문제·끈기왕", () => {
    let progress = createEmptyProgress();
    for (let i = 0; i < 4; i += 1) {
      progress = submitAction(
        progress,
        { problem: flowerZones, verdict: "wrong-answer", runtimeMs: null, ...at("2026-09-20") },
        TOPICS,
      ).progress;
    }
    const solved = submitAction(
      progress,
      { problem: flowerZones, verdict: "accepted", runtimeMs: 5, ...at("2026-09-20") },
      TOPICS,
    );
    expect(solved.earnedBadges.sort()).toEqual(["first-accept", "never-give-up", "no-hint-lv3"]);

    const ai = submitAction(
      solved.progress,
      { problem: generated("x"), verdict: "accepted", runtimeMs: 5, ...at("2026-09-21") },
      TOPICS,
    );
    expect(ai.earnedBadges).toEqual(["ai-pioneer"]);
    // 이미 받은 배지는 다시 주지 않는다
    expect(awardBadges(ai.progress, { type: "none" }, "2026-09-22T00:00:00.000Z").earned).toEqual([]);
  });

  it("스트릭·토픽 마스터·유형 탐정은 진도 상태로 판단한다", () => {
    const base = createEmptyProgress();
    const progress: UserProgress = {
      ...base,
      stats: { ...base.stats, currentStreak: 7, longestStreak: 7 },
      levelClears: [{ topic: "stack", level: 5, clearedAt: "2026-09-01T00:00:00.000Z" }],
      concepts: {
        stack: {
          topic: "stack",
          completedCardIds: [],
          completedAt: null,
          quizBestScore: 1,
          quizAttempts: 3,
          quizPerfectCount: 3,
        },
        dfs: {
          topic: "dfs",
          completedCardIds: [],
          completedAt: null,
          quizBestScore: 1,
          quizAttempts: 2,
          quizPerfectCount: 2,
        },
      },
    };
    expect(awardBadges(progress, { type: "none" }, "2026-09-22T00:00:00.000Z").earned.sort()).toEqual([
      "signal-detective",
      "streak-3",
      "streak-7",
      "topic-master",
    ]);
  });
});

describe("게스트 병합", () => {
  it("활동일로 스트릭을 다시 계산한다", () => {
    expect(
      streaksFromActivity([
        { date: "2026-09-01", xpEarned: 10, solvedCount: 0 },
        { date: "2026-09-02", xpEarned: 10, solvedCount: 0 },
        { date: "2026-09-03", xpEarned: 10, solvedCount: 0 },
        { date: "2026-09-05", xpEarned: 10, solvedCount: 0 },
        { date: "2026-09-06", xpEarned: 0, solvedCount: 0 },
      ]),
    ).toEqual({ currentStreak: 1, longestStreak: 3, lastActiveDate: "2026-09-05" });
  });

  it("양쪽 활동이 이어지면 스트릭도 이어지고, 같은 문제의 XP는 한 번만", () => {
    const account = submitAction(
      { ...createEmptyProgress(), userId: "u" },
      { problem: flowerZones, verdict: "accepted", runtimeMs: 30, ...at("2026-09-10") },
      TOPICS,
    ).progress;
    let guest = submitAction(
      createEmptyProgress(),
      { problem: flowerZones, verdict: "accepted", runtimeMs: 12, ...at("2026-09-11") },
      TOPICS,
    ).progress;
    guest = submitAction(
      guest,
      { problem: generated("g1"), verdict: "accepted", runtimeMs: 5, ...at("2026-09-12") },
      TOPICS,
    ).progress;

    const merged = mergeProgress(account, guest, TOPICS);
    expect(merged.userId).toBe("u");
    expect(merged.stats).toEqual({ xp: 30 + 20, currentStreak: 3, longestStreak: 3, lastActiveDate: "2026-09-12" });
    expect(merged.problems["c:dfs-flower-zones"]).toMatchObject({
      attempts: 2,
      bestRuntimeMs: 12,
      solvedAt: "2026-09-10T10:00:00.000Z",
      xpAwarded: 30,
    });
  });
});

describe("변경 목록 (RPC p_changes)", () => {
  it("바뀐 행만 담는다", () => {
    const before = createEmptyProgress();
    const after = submitAction(
      before,
      { problem: flowerZones, verdict: "accepted", runtimeMs: 30, ...at("2026-09-10") },
      TOPICS,
    ).progress;
    const changes = progressChanges(before, after);
    expect(changes.stats).toEqual({ xp: 30, current_streak: 1, longest_streak: 1, last_active_date: "2026-09-10" });
    expect(changes.activity).toEqual([{ activity_date: "2026-09-10", xp_earned: 30, solved_count: 1 }]);
    expect(changes.problems).toHaveLength(1);
    expect(changes.badges.map((b) => b.badge_id).sort()).toEqual(["first-accept", "no-hint-lv3"]);
    expect(isEmptyChanges(progressChanges(after, after))).toBe(true);
  });
});

describe("약점", () => {
  const sub = (
    problemKey: string,
    verdict: SubmissionSummary["verdict"],
    hintsOpened: 0 | 1 | 2 | 3 | 4 = 0,
  ): SubmissionSummary => ({
    id: Math.random().toString(),
    problemKey: problemKey as SubmissionSummary["problemKey"],
    source: "generated",
    topic: "bfs",
    level: 3,
    patternTags: ["grid-shortest-path"],
    language: "python",
    code: null,
    verdict,
    passed: 0,
    total: 1,
    runtimeMs: null,
    hintsOpened,
    createdAt: "2026-09-10T00:00:00.000Z",
  });

  it("엔진 오류는 빼고, 한 번도 못 맞힌 패턴은 힌트 항을 최대로", () => {
    const stats = computePatternStats([
      sub("g:a", "wrong-answer"),
      sub("g:b", "wrong-answer"),
      sub("g:b", "internal-error"),
    ]);
    expect(stats).toEqual([
      {
        pattern: "grid-shortest-path",
        problemsAttempted: 2,
        problemsSolved: 0,
        submissions: 2,
        acceptedSubmissions: 0,
        avgHintsOnAccept: null,
        lastAttemptAt: "2026-09-10T00:00:00.000Z",
      },
    ]);
    expect(weaknessScores(stats)[0]?.score).toBe(1);
  });

  it("추천 링크는 토픽·패턴·관련 신호를 채운다", () => {
    expect(aiLabHrefForPatterns(["grid-shortest-path"])).toBe(
      "/ai-lab?topic=bfs&patterns=grid-shortest-path&signals=sig-grid-neighbors%2Csig-shortest-steps",
    );
  });
});

describe("요청 검증", () => {
  it("브라우저에 저장된 게스트 진도 형식을 그대로 받는다", () => {
    const demo = createDemoProgress("2026-09-20", "2026-09-20T01:00:00.000Z");
    expect(mergeBodySchema.safeParse({ progress: demo, submissions: [] }).success).toBe(true);
  });

  it("계정 진도(userId 있음)나 범위 밖 값은 거부한다", () => {
    const demo = createDemoProgress("2026-09-20", "2026-09-20T01:00:00.000Z");
    expect(mergeBodySchema.safeParse({ progress: { ...demo, userId: "someone" }, submissions: [] }).success).toBe(
      false,
    );
    expect(
      mergeBodySchema.safeParse({ progress: { ...demo, stats: { ...demo.stats, xp: -1 } }, submissions: [] }).success,
    ).toBe(false);
  });

  it("로그인 뒤 돌아갈 주소는 사이트 안 경로만", () => {
    expect(safeNextPath("/problems/dfs-flower-zones")).toBe("/problems/dfs-flower-zones");
    expect(safeNextPath("https://evil.example")).toBe("/");
    expect(safeNextPath("//evil.example")).toBe("/");
    expect(safeNextPath("/\\evil.example")).toBe("/");
    expect(safeNextPath("/auth/callback")).toBe("/");
    expect(safeNextPath(null)).toBe("/");
  });
});

describe("조사", () => {
  it("받침에 따라 이/가를 고른다", async () => {
    const { particle } = await import("@/lib/korean");
    expect(particle("최단 거리", "이", "가")).toBe("가");
    expect(particle("연결 요소", "이", "가")).toBe("가");
    expect(particle("괄호 짝 맞추기", "이", "가")).toBe("가");
    expect(particle("단조 스택", "이", "가")).toBe("이");
    expect(particle("BFS", "이", "가")).toBe("이(가)");
  });
});
