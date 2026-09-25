import { describe, expect, it } from "vitest";
import { flowerZones } from "@/content/problems/dfs/flower-zones";
import { TOPICS } from "@/content/topics";
import { applyHintOpen, applySubmission } from "@/lib/progress/submission";
import { createDemoProgress, createEmptyProgress } from "@/stores/progress-store";

const TODAY = "2026-09-23";
const NOW = "2026-09-23T05:00:00.000Z";

const submit = (
  progress: ReturnType<typeof createEmptyProgress>,
  verdict: "accepted" | "wrong-answer" | "internal-error",
) => applySubmission(progress, { problem: flowerZones, verdict, runtimeMs: 12.4, today: TODAY, now: NOW }, TOPICS);

describe("applyHintOpen", () => {
  it("순서대로만 열 수 있다", () => {
    const empty = createEmptyProgress();
    expect(() => applyHintOpen(empty, flowerZones, 2, NOW)).toThrow("1번 힌트를 먼저");
    const one = applyHintOpen(empty, flowerZones, 1, NOW);
    expect(one.problems["c:dfs-flower-zones"]?.maxHintOpened).toBe(1);
    expect(one.problems["c:dfs-flower-zones"]?.status).toBe("attempted");
    // 이미 연 힌트를 다시 열어도 그대로
    expect(applyHintOpen(one, flowerZones, 1, NOW)).toBe(one);
  });
});

describe("applySubmission", () => {
  it("오답은 시도만 늘리고 XP는 주지 않는다", () => {
    const { progress, outcome } = submit(createEmptyProgress(), "wrong-answer");
    expect(progress.problems["c:dfs-flower-zones"]).toMatchObject({ attempts: 1, status: "attempted" });
    expect(outcome).toEqual({ firstSolve: false, xpAwarded: 0, levelCleared: null, unlockedTopic: null });
    expect(progress.stats.xp).toBe(0);
  });

  it("엔진 오류로 끝난 제출은 기록하지 않는다", () => {
    const empty = createEmptyProgress();
    expect(submit(empty, "internal-error").progress).toBe(empty);
  });

  it("첫 정답: 힌트 감소를 적용한 XP, 스트릭·활동 기록", () => {
    let progress = createEmptyProgress();
    progress = applyHintOpen(progress, flowerZones, 1, NOW);
    progress = applyHintOpen(progress, flowerZones, 2, NOW);
    const { progress: next, outcome } = submit(progress, "accepted");
    expect(outcome.firstSolve).toBe(true);
    expect(outcome.xpAwarded).toBe(26); // 30 × (1 − 0.15)
    expect(next.stats).toMatchObject({ xp: 26, currentStreak: 1, lastActiveDate: TODAY });
    expect(next.activity).toEqual([{ date: TODAY, xpEarned: 26, solvedCount: 1 }]);
    expect(next.problems["c:dfs-flower-zones"]).toMatchObject({ status: "solved", solvedAt: NOW, bestRuntimeMs: 12 });
  });

  it("이미 푼 문제를 다시 맞혀도 XP는 한 번만", () => {
    const first = submit(createEmptyProgress(), "accepted").progress;
    const { progress, outcome } = submit(first, "accepted");
    expect(outcome.firstSolve).toBe(false);
    expect(progress.stats.xp).toBe(30);
    expect(progress.problems["c:dfs-flower-zones"]?.attempts).toBe(2);
  });

  it("정답으로 레벨 조건을 채우면 레벨 클리어 + 다음 토픽 해제 (DFS Lv3 → BFS)", () => {
    const demo = createDemoProgress(TODAY, NOW);
    // DFS Lv3은 2문제를 풀어야 해요. 다른 한 문제는 이미 푼 상태에서 꽃밭 구역을 맞힌다
    const otherSlug = TOPICS.find((t) => t.slug === "dfs")?.levels[2].problemSlugs.find(
      (slug) => slug !== flowerZones.slug,
    );
    if (!otherSlug) throw new Error("DFS Lv3에 두 번째 문제가 없어요");
    const before = {
      ...demo,
      problems: {
        ...demo.problems,
        [`c:${otherSlug}`]: {
          problemKey: `c:${otherSlug}`,
          source: "curated" as const,
          topic: "dfs" as const,
          level: 3 as const,
          status: "solved" as const,
          attempts: 1,
          maxHintOpened: 0,
          lastCode: null,
          solvedAt: NOW,
          bestRuntimeMs: 10,
          xpAwarded: 30,
          updatedAt: NOW,
        },
      },
    };
    expect(submit(demo, "accepted").outcome.levelCleared).toBeNull();
    const { progress, outcome } = submit(before, "accepted");
    expect(outcome.levelCleared).toBe(3);
    expect(outcome.unlockedTopic).toBe("bfs");
    expect(progress.levelClears.some((c) => c.topic === "dfs" && c.level === 3)).toBe(true);
  });

  it("잠긴 레벨의 문제를 미리 풀면 XP는 받지만 레벨 클리어·토픽 해제는 안 된다", () => {
    const { progress, outcome } = submit(createEmptyProgress(), "accepted");
    expect(outcome.firstSolve).toBe(true);
    expect(outcome.xpAwarded).toBe(30);
    expect(outcome.levelCleared).toBeNull();
    expect(outcome.unlockedTopic).toBeNull();
    expect(progress.levelClears).toEqual([]);
  });
});
