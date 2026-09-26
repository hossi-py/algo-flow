import { describe, expect, it } from "vitest";
import { seoulToday, untilReset, weekRange } from "@/lib/ranking/week";

describe("랭킹 주간 (월~일, 한국 시간)", () => {
  it("어느 요일이든 그 주 월요일~일요일을 돌려준다", () => {
    expect(weekRange("2026-09-21")).toEqual({ start: "2026-09-21", end: "2026-09-27" }); // 월
    expect(weekRange("2026-09-26")).toEqual({ start: "2026-09-21", end: "2026-09-27" }); // 토
    expect(weekRange("2026-09-27")).toEqual({ start: "2026-09-21", end: "2026-09-27" }); // 일
    expect(weekRange("2026-12-31")).toEqual({ start: "2026-12-28", end: "2027-01-03" }); // 해를 넘긴다
  });

  it("한국 날짜 기준이라 UTC로는 전날 밤이어도 한국이 월요일이면 새 주다", () => {
    const mondayMorningKst = new Date("2026-09-20T15:30:00Z"); // 9/21(월) 00:30 KST
    expect(seoulToday(mondayMorningKst)).toBe("2026-09-21");
    expect(weekRange(seoulToday(mondayMorningKst)).start).toBe("2026-09-21");
  });

  it("다음 주 월요일 0시까지 남은 시간", () => {
    expect(untilReset(new Date("2026-09-26T12:00:00+09:00"))).toEqual({ days: 1, hours: 12 }); // 토 정오
    expect(untilReset(new Date("2026-09-27T23:00:00+09:00"))).toEqual({ days: 0, hours: 1 }); // 일 밤 11시
  });
});
