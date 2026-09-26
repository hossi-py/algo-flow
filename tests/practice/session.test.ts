import { describe, expect, it } from "vitest";
import { PROBLEMS } from "@/content/problems";
import { TOPICS } from "@/content/topics";
import {
  CHOICE_COUNT,
  buildSession,
  pickChoices,
  practicePool,
  revealsTopic,
  seededRng,
  tallyByTopic,
} from "@/lib/practice/session";

const ALL = TOPICS.map((t) => t.slug);

describe("섞어 풀기 출제 후보", () => {
  const pool = practicePool(PROBLEMS);

  it("본문에 자기 토픽 이름이 나오는 문제는 내지 않는다", () => {
    const leaked = PROBLEMS.filter(revealsTopic).map((p) => p.slug);
    expect(leaked.length).toBeGreaterThan(0);
    for (const slug of leaked) expect(pool.some((p) => p.slug === slug)).toBe(false);
  });

  it("Lv2 이상의 큐레이션 문제만 낸다", () => {
    expect(pool.every((p) => p.level >= 2 && p.source === "curated")).toBe(true);
  });

  it("모든 토픽에서 한 번에 10문제를 골고루 낼 만큼 문제가 있다", () => {
    for (const topic of ALL) {
      expect(pool.filter((p) => p.topic === topic).length, topic).toBeGreaterThanOrEqual(5);
    }
  });

  it("범위를 주면 그 토픽 문제만 낸다", () => {
    const some = practicePool(PROBLEMS, ["stack", "hash"]);
    expect(new Set(some.map((p) => p.topic))).toEqual(new Set(["stack", "hash"]));
  });
});

describe("보기", () => {
  it.each(ALL)("%s: 정답을 포함한 서로 다른 4개", (answer) => {
    for (let seed = 1; seed <= 20; seed++) {
      const choices = pickChoices(answer, ALL, seededRng(seed));
      expect(choices).toHaveLength(CHOICE_COUNT);
      expect(new Set(choices).size).toBe(CHOICE_COUNT);
      expect(choices).toContain(answer);
    }
  });

  it("정답의 자리가 한쪽으로 쏠리지 않는다", () => {
    const positions = new Set<number>();
    for (let seed = 1; seed <= 40; seed++) positions.add(pickChoices("dfs", ALL, seededRng(seed)).indexOf("dfs"));
    expect(positions.size).toBe(CHOICE_COUNT);
  });
});

describe("문제 섞기", () => {
  const pool = practicePool(PROBLEMS);

  it("요청한 수만큼 서로 다른 문제를 토픽이 몰리지 않게 낸다", () => {
    for (let seed = 1; seed <= 10; seed++) {
      const session = buildSession(pool, 10, ALL, seededRng(seed));
      expect(session).toHaveLength(10);
      expect(new Set(session.map((q) => q.problem.id)).size).toBe(10);
      // 토픽이 11개라 10문제면 한 토픽에서 한 문제씩
      expect(new Set(session.map((q) => q.problem.topic)).size).toBe(10);
    }
  });

  it("같은 시드면 같은 문제·보기가 나온다", () => {
    const a = buildSession(pool, 5, ALL, seededRng(42));
    const b = buildSession(pool, 5, ALL, seededRng(42));
    expect(a.map((q) => [q.problem.id, q.choices])).toEqual(b.map((q) => [q.problem.id, q.choices]));
  });

  it("후보가 모자라면 있는 만큼만 낸다", () => {
    const small = practicePool(PROBLEMS, ["stack"]).slice(0, 3);
    expect(buildSession(small, 10, ALL, seededRng(1))).toHaveLength(3);
  });
});

describe("기록", () => {
  it("토픽별로 나온 횟수와 맞힌 횟수를 센다", () => {
    const tally = tallyByTopic([
      { problemKey: "a", topic: "dfs", picked: "dfs" },
      { problemKey: "b", topic: "dfs", picked: "bfs" },
      { problemKey: "c", topic: "hash", picked: "hash" },
    ]);
    expect(tally.get("dfs")).toEqual({ seen: 2, correct: 1 });
    expect(tally.get("hash")).toEqual({ seen: 1, correct: 1 });
  });
});
