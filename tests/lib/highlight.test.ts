import { describe, expect, it } from "vitest";
import { highlightSegments } from "@/lib/highlight";

const join = (segments: { text: string }[]) => segments.map((s) => s.text).join("");

describe("highlightSegments", () => {
  it("문구가 없거나 못 찾으면 원문 한 조각", () => {
    expect(highlightSegments("스택 문제", [])).toEqual([{ text: "스택 문제", hit: false }]);
    expect(highlightSegments("스택 문제", ["큐"])).toEqual([{ text: "스택 문제", hit: false }]);
    expect(highlightSegments("", ["a"])).toEqual([]);
  });

  it("문구를 찾아 앞뒤를 나눈다", () => {
    expect(highlightSegments("도착한 순서대로 처리", ["순서대로"])).toEqual([
      { text: "도착한 ", hit: false },
      { text: "순서대로", hit: true },
      { text: " 처리", hit: false },
    ]);
  });

  it("같은 문구가 여러 번 나오면 모두 칠한다", () => {
    const segments = highlightSegments("최소 횟수, 또 최소 횟수", ["최소"]);
    expect(segments.filter((s) => s.hit).map((s) => s.text)).toEqual(["최소", "최소"]);
  });

  it("겹치거나 맞닿은 문구는 한 구간으로 합친다", () => {
    expect(highlightSegments("abcdef", ["bcd", "cde"])).toEqual([
      { text: "a", hit: false },
      { text: "bcde", hit: true },
      { text: "f", hit: false },
    ]);
    expect(highlightSegments("abcdef", ["ab", "cd"])).toEqual([
      { text: "abcd", hit: true },
      { text: "ef", hit: false },
    ]);
  });

  it("빈 문구는 무시하고, 조각을 이으면 항상 원문과 같다", () => {
    const text = "붙어 있으면 지워요. 새로 붙게 된 글자끼리도";
    const segments = highlightSegments(text, ["", "붙어 있으면 지워요", "새로 붙게 된", "없는 말"]);
    expect(join(segments)).toBe(text);
    expect(segments.filter((s) => s.hit)).toHaveLength(2);
  });
});
