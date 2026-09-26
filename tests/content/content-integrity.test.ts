import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PROBLEMS } from "@/content/problems";
import { SIGNALS, getSignal } from "@/content/signals";
import { TOPICS, getTopic } from "@/content/topics";
import { BASE_XP_BY_LEVEL } from "@/lib/progress/xp";
import { LANGUAGES, TOPIC_SLUGS, type JsonValue, type Problem } from "@/types";

const ROOT = path.resolve(__dirname, "../..");

function solutionPath(problem: Problem, ext: "js" | "py" | "java"): string {
  const name = problem.slug.startsWith(`${problem.topic}-`)
    ? problem.slug.slice(problem.topic.length + 1)
    : problem.slug;
  return path.join(ROOT, "content-solutions", problem.topic, `${name}.${ext}`);
}

/** js.worker 하네스와 같은 방식으로 정답 코드를 평가한다 */
function loadJsSolution(code: string): (...args: JsonValue[]) => unknown {
  const factory = new Function(`${code}\nreturn typeof solution === "function" ? solution : undefined;`);
  const solution: unknown = factory();
  if (typeof solution !== "function") throw new Error("solution 함수가 없어요");
  return solution as (...args: JsonValue[]) => unknown;
}

describe("토픽", () => {
  it("커리큘럼 순서와 슬러그가 타입 정의와 일치한다", () => {
    expect(TOPICS.map((t) => t.slug)).toEqual([...TOPIC_SLUGS]);
    expect(TOPICS.map((t) => t.order)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
  });

  it.each(TOPICS.map((t) => [t.slug, t] as const))("%s: 레벨 1~5가 순서대로 있다", (_, topic) => {
    expect(topic.levels.map((l) => l.level)).toEqual([1, 2, 3, 4, 5]);
    expect(topic.levels.every((l) => l.topic === topic.slug)).toBe(true);
    expect(topic.levels[0].clearRule.requiresConcept).toBe(true);
  });

  it("입문(시간 복잡도)과 스택은 처음부터 열려 있고, 나머지는 바로 앞 토픽의 Lv3 클리어로 열린다", () => {
    expect(TOPICS.slice(0, 2).map((t) => t.slug)).toEqual(["complexity", "stack"]);
    TOPICS.forEach((topic, index) => {
      if (index <= 1) {
        expect(topic.unlock).toEqual({ type: "always" });
      } else {
        expect(topic.unlock).toEqual({ type: "level-cleared", topic: TOPICS[index - 1]?.slug, level: 3 });
      }
    });
  });

  it("토픽이 참조하는 신호가 모두 존재하고, 신호의 의심 토픽도 유효하다", () => {
    for (const topic of TOPICS) {
      for (const id of topic.signalIds) expect(getSignal(id), id).toBeDefined();
    }
    for (const signal of SIGNALS) {
      for (const slug of signal.suspects) expect(getTopic(slug), `${signal.id} → ${slug}`).toBeDefined();
    }
    expect(new Set(SIGNALS.map((s) => s.id)).size).toBe(SIGNALS.length);
  });
});

describe("문제 등록", () => {
  it("레벨이 참조하는 문제가 모두 존재하고 토픽·레벨이 일치한다", () => {
    for (const topic of TOPICS) {
      for (const level of topic.levels) {
        for (const slug of level.problemSlugs) {
          const problem = PROBLEMS.find((p) => p.slug === slug);
          expect(problem, slug).toBeDefined();
          expect(problem?.topic).toBe(topic.slug);
          expect(problem?.level).toBe(level.level);
        }
      }
    }
  });

  it("모든 문제는 정확히 한 레벨에 등록되어 있다", () => {
    for (const problem of PROBLEMS) {
      const count = TOPICS.flatMap((t) => t.levels).filter((l) => l.problemSlugs.includes(problem.slug)).length;
      expect(count, problem.slug).toBe(1);
    }
  });
});

describe.each(PROBLEMS.map((p) => [p.slug, p] as const))("문제 %s", (_, problem) => {
  it("기본 정보가 규칙에 맞다", () => {
    expect(problem.id).toBe(`c:${problem.slug}`);
    expect(problem.xp).toBe(BASE_XP_BY_LEVEL[problem.level]);
    expect(problem.signalIds.every((id) => getSignal(id) !== undefined)).toBe(true);
    for (const language of LANGUAGES) expect(problem.starterCode[language]?.length ?? 0).toBeGreaterThan(0);
  });

  it("힌트는 4단계이고 감소율이 점점 커진다", () => {
    expect(problem.hints.map((h) => h.step)).toEqual([1, 2, 3, 4]);
    expect(problem.hints.map((h) => h.kind)).toEqual(["pattern", "approach", "pseudocode", "key-code"]);
    const rates = problem.hints.map((h) => h.xpPenaltyRate);
    rates.forEach((rate, i) => {
      expect(rate).toBeGreaterThan(0);
      expect(rate).toBeLessThan(1);
      if (i > 0) expect(rate).toBeGreaterThan(rates[i - 1] ?? 0);
    });
    expect(problem.hints[3].code, "힌트4에는 핵심 코드가 있어야 해요").toBeDefined();
  });

  it("테스트케이스: id가 겹치지 않고 예제가 2개 이상, 숨은 케이스가 4개 이상", () => {
    const ids = problem.testCases.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(problem.testCases.filter((t) => t.visibility === "example").length).toBeGreaterThanOrEqual(2);
    expect(problem.testCases.filter((t) => t.visibility === "hidden").length).toBeGreaterThanOrEqual(4);
    for (const testCase of problem.testCases) {
      expect(testCase.args.length).toBe(problem.signature.params.length);
    }
  });

  it("Python·JavaScript·Java 정답 코드 파일이 모두 있다", () => {
    for (const ext of ["py", "js", "java"] as const) {
      expect(existsSync(solutionPath(problem, ext)), solutionPath(problem, ext)).toBe(true);
    }
  });

  it("Java 시그니처·시작 코드가 서로 맞다 (큐레이션 문제는 Java를 모두 지원)", () => {
    const java = problem.starterCode.java ?? "";
    expect(java).toContain("class Solution");
    for (const param of problem.signature.params) {
      expect(param.type.java, param.name).toBeTruthy();
      expect(java).toContain(`${param.type.java} ${param.name}`);
    }
    expect(java).toContain(`public ${problem.signature.returns.type.java} solution(`);
  });

  it("JavaScript 정답 코드가 모든 테스트케이스를 통과한다", () => {
    const solution = loadJsSolution(readFileSync(solutionPath(problem, "js"), "utf8"));
    for (const testCase of problem.testCases) {
      const actual = solution(...structuredClone(testCase.args));
      expect(actual, testCase.id).toEqual(testCase.expected);
    }
  });

  it("힌트4 코드는 전체 정답이 아니다 (빈칸을 남긴다)", () => {
    const code = problem.hints[3].code?.code;
    for (const language of LANGUAGES) {
      expect(code?.[language]).toContain("______");
    }
  });
});
