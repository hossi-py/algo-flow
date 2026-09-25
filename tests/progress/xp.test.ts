import { describe, expect, it } from "vitest";
import { flowerZones } from "@/content/problems/dfs/flower-zones";
import { levelProgress, nodiGrowth, problemXp, userLevel, xpRequiredForLevel } from "@/lib/progress/xp";

describe("problemXp", () => {
  it("힌트를 안 열면 기본 XP를 전부 준다", () => {
    expect(problemXp(30, 0)).toBe(30);
  });

  it("기본 감소율: 힌트1 5% · 힌트2 15% · 힌트3 30% · 힌트4 50%", () => {
    expect(problemXp(100, 1)).toBe(95);
    expect(problemXp(100, 2)).toBe(85);
    expect(problemXp(100, 3)).toBe(70);
    expect(problemXp(100, 4)).toBe(50);
  });

  it("문제에 정의된 힌트의 감소율을 우선 사용한다", () => {
    expect(problemXp(flowerZones.xp, 4, flowerZones.hints)).toBe(15);
    expect(problemXp(flowerZones.xp, 2, flowerZones.hints)).toBe(26);
  });

  it("최소 1XP는 준다", () => {
    expect(problemXp(1, 4)).toBe(1);
  });
});

describe("사용자 레벨", () => {
  it("레벨 n 도달 XP = 25 × n × (n − 1)", () => {
    expect(xpRequiredForLevel(1)).toBe(0);
    expect(xpRequiredForLevel(2)).toBe(50);
    expect(xpRequiredForLevel(3)).toBe(150);
    expect(xpRequiredForLevel(10)).toBe(2250);
  });

  it.each([
    [0, 1],
    [49, 1],
    [50, 2],
    [149, 2],
    [150, 3],
    [499, 4],
    [500, 5],
    [2250, 10],
    [-10, 1],
  ])("XP %i → Lv%i", (xp, level) => {
    expect(userLevel(xp)).toBe(level);
  });

  it("다음 레벨까지의 진행률", () => {
    expect(levelProgress(100)).toEqual({ level: 2, current: 50, needed: 100, ratio: 0.5 });
    expect(levelProgress(0)).toEqual({ level: 1, current: 0, needed: 50, ratio: 0 });
  });
});

describe("노디 성장", () => {
  it.each([
    [1, "sprout"],
    [3, "sprout"],
    [4, "leaves"],
    [6, "leaves"],
    [7, "bud"],
    [9, "bud"],
    [10, "bloom"],
    [20, "bloom"],
  ] as const)("Lv%i → %s", (level, growth) => {
    expect(nodiGrowth(level)).toBe(growth);
  });
});
