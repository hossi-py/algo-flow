import { describe, expect, it } from "vitest";
import { TOPICS, getTopic } from "@/content/topics";
import { computeTopicViews, findNextStep, meetsLevelClearRule, type ProgressFacts } from "@/lib/progress/unlock";
import { createDemoProgress, createEmptyProgress } from "@/stores/progress-store";
import type { LevelClear, LevelNumber, TopicSlug } from "@/types";

const NOW = "2026-09-23T01:00:00.000Z";

function clears(topic: TopicSlug, upTo: LevelNumber): LevelClear[] {
  return Array.from({ length: upTo }, (_, i) => ({ topic, level: (i + 1) as LevelNumber, clearedAt: NOW }));
}

function facts(levelClears: LevelClear[], problems: ProgressFacts["problems"] = {}): ProgressFacts {
  return { levelClears, problems, concepts: {} };
}

function view(f: ProgressFacts, slug: TopicSlug) {
  const found = computeTopicViews(f, TOPICS).find((v) => v.topic === slug);
  if (!found) throw new Error(`no view for ${slug}`);
  return found;
}

describe("토픽 잠금", () => {
  it("처음에는 스택만 열려 있고, 나머지는 이전 토픽 Lv3 조건을 안내한다", () => {
    const f = facts([]);
    expect(view(f, "stack").status).toBe("available");
    const queue = view(f, "queue-deque");
    expect(queue.status).toBe("locked");
    expect(queue.lockedReason).toBe("스택 Lv3 클리어 후 열려요");
    expect(view(f, "backtracking").lockedReason).toBe("BFS Lv3 클리어 후 열려요");
  });

  it("스택 Lv3을 클리어하면 큐/덱이 열린다 (Lv2까지만으로는 안 열림)", () => {
    expect(view(facts(clears("stack", 2)), "queue-deque").status).toBe("locked");
    expect(view(facts(clears("stack", 3)), "queue-deque").status).toBe("available");
  });

  it("Lv5까지 클리어하면 마스터", () => {
    const v = view(facts(clears("stack", 5)), "stack");
    expect(v.status).toBe("mastered");
    expect(v.progress).toBe(1);
  });
});

describe("레벨 잠금", () => {
  it("Lv1은 열려 있고 Lv2부터는 이전 레벨 클리어가 필요하다", () => {
    const levels = view(facts([]), "stack").levels;
    expect(levels[0]?.status).toBe("available");
    expect(levels[1]?.status).toBe("locked");
    expect(levels[1]?.lockedReason).toBe("Lv1 클리어 후 열려요");
  });

  it("잠긴 토픽의 레벨은 모두 잠겨 있다", () => {
    const levels = view(facts([]), "dfs").levels;
    expect(levels.every((l) => l.status === "locked")).toBe(true);
  });

  it("문제를 시도하면 in-progress", () => {
    const demo = createDemoProgress("2026-09-23", NOW);
    const dfs = view(demo, "dfs");
    expect(dfs.levels[2]?.status).toBe("in-progress");
    expect(dfs.levels[3]?.status).toBe("locked");
    expect(dfs.status).toBe("in-progress");
    expect(view(demo, "bfs").status).toBe("locked");
  });
});

describe("레벨 클리어 조건", () => {
  const dfs = getTopic("dfs");
  const stack = getTopic("stack");
  if (!dfs || !stack) throw new Error("topics missing");

  it("문제 수보다 많이 요구하지 않는다 (문제 1개뿐인 레벨 → 1개 해결로 클리어)", () => {
    const level = { ...dfs.levels[2], problemSlugs: ["dfs-flower-zones"] };
    const solved = facts([], {
      "c:dfs-flower-zones": {
        problemKey: "c:dfs-flower-zones",
        source: "curated",
        topic: "dfs",
        level: 3,
        status: "solved",
        attempts: 1,
        maxHintOpened: 0,
        lastCode: null,
        solvedAt: NOW,
        bestRuntimeMs: 12,
        xpAwarded: 30,
        updatedAt: NOW,
      },
    });
    expect(meetsLevelClearRule(solved, dfs, level)).toBe(true);
    expect(meetsLevelClearRule(facts([]), dfs, level)).toBe(false);
  });

  it("문제가 없는 레벨은 클리어할 수 없다", () => {
    expect(meetsLevelClearRule(facts([]), stack, stack.levels[0])).toBe(false);
  });
});

describe("findNextStep", () => {
  it("처음이면 스택 Lv1", () => {
    expect(findNextStep(createEmptyProgress(), TOPICS)).toEqual({
      topic: "stack",
      level: 1,
      problemSlug: TOPICS[0]?.levels[0].problemSlugs[0],
    });
  });

  it("이미 시작한 레벨을 이어서 하도록 먼저 추천한다 (앞 토픽에 남은 레벨이 있어도)", () => {
    const demo = createDemoProgress("2026-09-23", NOW);
    expect(findNextStep(demo, TOPICS)).toEqual({ topic: "dfs", level: 3, problemSlug: "dfs-flower-zones" });
  });
});
