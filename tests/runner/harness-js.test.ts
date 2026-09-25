import { describe, expect, it } from "vitest";
import { checkJsSyntax, normalizeJsValue, runJsCase } from "@/lib/runner/harness-js";

const run = (code: string, args: unknown[] = [[]]) =>
  runJsCase({ code, functionName: "solution", args: args as never, stdoutLimit: 1000 });

describe("runJsCase", () => {
  it("반환값과 console.log 출력을 돌려준다", () => {
    const result = run("function solution(xs) {\n  console.log('길이', xs.length, [1, 2]);\n  return xs.length;\n}", [
      [1, 2, 3],
    ]);
    expect(result).toMatchObject({ ok: true, value: 3, stdout: "길이 3 [1, 2]\n" });
  });

  it("화살표 함수와 const 선언도 solution으로 인식한다", () => {
    expect(run("const solution = (a, b) => a + b;", [1, 2])).toMatchObject({ ok: true, value: 3 });
  });

  it("문법 오류는 compile 단계 오류로, 줄 번호와 함께 알려 준다", () => {
    const result = run("function solution(g) {\n  return [\n}\n");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.phase).toBe("compile");
    expect(result.error.type).toBe("SyntaxError");
    expect(result.error.line).toBe(3);
  });

  it("실행 중 오류는 사용자 코드 기준 줄 번호를 알려 준다", () => {
    const result = run("function solution(g) {\n  const x = null;\n  console.log('before');\n  return x.length;\n}");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.phase).toBe("runtime");
    expect(result.error.type).toBe("TypeError");
    expect(result.error.line).toBe(4);
    expect(result.stdout).toBe("before\n");
  });

  it("solution이 없으면 안내한다", () => {
    const result = run("function answer() { return 1; }");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toContain("solution 함수를 찾을 수 없어요");
  });

  it("인자를 복사해서 넘기므로 사용자가 인자를 바꿔도 원본은 그대로다", () => {
    const args = [[1, 2, 3]];
    run("function solution(xs) { xs.push(4); return xs; }", args);
    expect(args).toEqual([[1, 2, 3]]);
  });

  it("케이스마다 새 스코프에서 실행해 전역 상태가 이어지지 않는다", () => {
    const code = "let count = 0;\nfunction solution() { count += 1; return count; }";
    expect(run(code)).toMatchObject({ value: 1 });
    expect(run(code)).toMatchObject({ value: 1 });
  });

  it("깊은 재귀 오류를 알아보기 쉽게 알려 준다", () => {
    const result = run("function solution() {\n  const f = (n) => f(n + 1);\n  return f(0);\n}");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toContain("재귀 호출이 너무 깊어요");
  });

  it("async 함수는 거절한다", () => {
    const result = run("async function solution() { return 1; }");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toContain("동기 함수");
  });

  it("출력이 너무 길면 자른다", () => {
    const result = run("function solution() { for (let i = 0; i < 1000; i++) console.log('0123456789'); return 0; }");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.stdout.length).toBeLessThan(1100);
      expect(result.stdout).toContain("잘랐어요");
    }
  });
});

describe("normalizeJsValue (Python 하네스와 같은 규칙)", () => {
  it("Set은 정렬된 배열, Map은 객체, undefined는 null", () => {
    expect(normalizeJsValue(new Set([3, 1, 2]))).toEqual([1, 2, 3]);
    expect(normalizeJsValue(new Map([["a", 1]]))).toEqual({ a: 1 });
    expect(normalizeJsValue(undefined)).toBeNull();
    expect(normalizeJsValue([1, undefined])).toEqual([1, null]);
  });

  it("NaN·Infinity·안전하지 않은 정수·함수는 오류", () => {
    expect(() => normalizeJsValue(NaN)).toThrow();
    expect(() => normalizeJsValue([Infinity])).toThrow();
    expect(() => normalizeJsValue(2 ** 60)).toThrow();
    expect(() => normalizeJsValue(() => 1)).toThrow();
  });

  it("순환 참조는 오류", () => {
    const a: Record<string, unknown> = {};
    a.self = a;
    expect(() => normalizeJsValue(a)).toThrow("순환 참조");
  });
});

describe("checkJsSyntax", () => {
  it("올바른 코드는 null", () => {
    expect(checkJsSyntax("function solution() { return 1 }")).toBeNull();
  });
});
