import { describe, expect, it } from "vitest";
import { addDays, diffDays, toLocalDate, weekOf, weekdayIndex } from "@/lib/date";
import { addActivityDay, applyActivity, visibleStreak } from "@/lib/progress/streak";
import type { UserStats } from "@/types";

const fresh: UserStats = { xp: 0, currentStreak: 0, longestStreak: 0, lastActiveDate: null };

describe("날짜 (Asia/Seoul)", () => {
  it("UTC 15:00 이후는 한국 날짜로 다음 날이다", () => {
    expect(toLocalDate(new Date("2026-09-22T14:59:59Z"))).toBe("2026-09-22");
    expect(toLocalDate(new Date("2026-09-22T15:00:00Z"))).toBe("2026-09-23");
  });

  it("월말·연말을 넘어 날짜를 더한다", () => {
    expect(addDays("2026-09-30", 1)).toBe("2026-10-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(diffDays("2026-09-23", "2026-10-03")).toBe(10);
  });

  it("주는 월요일부터 시작한다", () => {
    // 2026-09-23은 수요일
    expect(weekdayIndex("2026-09-23")).toBe(2);
    expect(weekOf("2026-09-23")[0]).toBe("2026-09-21");
    expect(weekOf("2026-09-23")[6]).toBe("2026-09-27");
  });
});

describe("applyActivity", () => {
  it("첫 활동이면 스트릭 1", () => {
    expect(applyActivity(fresh, "2026-09-23", 10)).toEqual({
      xp: 10,
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: "2026-09-23",
    });
  });

  it("같은 날 또 하면 XP만 쌓이고 스트릭은 그대로", () => {
    const day1 = applyActivity(fresh, "2026-09-23", 10);
    expect(applyActivity(day1, "2026-09-23", 5)).toEqual({ ...day1, xp: 15 });
  });

  it("다음 날 하면 +1, 하루라도 건너뛰면 1로 다시 시작", () => {
    const day1 = applyActivity(fresh, "2026-09-23", 10);
    const day2 = applyActivity(day1, "2026-09-24", 10);
    expect(day2.currentStreak).toBe(2);
    const day4 = applyActivity(day2, "2026-09-26", 10);
    expect(day4.currentStreak).toBe(1);
    expect(day4.longestStreak).toBe(2);
  });

  it("XP가 0 이하이면 아무것도 바뀌지 않는다", () => {
    expect(applyActivity(fresh, "2026-09-23", 0)).toBe(fresh);
  });
});

describe("visibleStreak", () => {
  const stats: UserStats = { xp: 100, currentStreak: 5, longestStreak: 5, lastActiveDate: "2026-09-22" };

  it("어제까지 이어졌으면 오늘 아직 안 했어도 유지로 보인다", () => {
    expect(visibleStreak(stats, "2026-09-22")).toBe(5);
    expect(visibleStreak(stats, "2026-09-23")).toBe(5);
  });

  it("이틀 이상 비면 0", () => {
    expect(visibleStreak(stats, "2026-09-24")).toBe(0);
    expect(visibleStreak(fresh, "2026-09-24")).toBe(0);
  });
});

describe("addActivityDay", () => {
  it("같은 날짜는 합치고, 새 날짜는 정렬해 추가한다", () => {
    const a = addActivityDay([], "2026-09-23", 10, 1);
    const b = addActivityDay(a, "2026-09-23", 5, 0);
    const c = addActivityDay(b, "2026-09-21", 20, 2);
    expect(c).toEqual([
      { date: "2026-09-21", xpEarned: 20, solvedCount: 2 },
      { date: "2026-09-23", xpEarned: 15, solvedCount: 1 },
    ]);
  });
});
