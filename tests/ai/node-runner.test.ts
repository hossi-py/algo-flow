import { afterAll, describe, expect, it } from "vitest";
import { createNodePythonRunner } from "@/lib/runner-node/node-runner";

const runner = createNodePythonRunner();
afterAll(() => runner.dispose());

const OPTIONS = { recursionLimit: 3000, timeoutMs: 2000 };

describe("Node Python 러너", () => {
  it("정답 코드를 실행해 반환값을 돌려준다", async () => {
    const outcome = await runner.run("def solution(xs):\n    return sorted(set(xs))\n", [[3, 1, 3]], OPTIONS);
    expect(outcome).toMatchObject({ kind: "ok", value: [1, 3] });
  }, 60_000);

  it("무한 루프는 시간 초과로 끊고, 다음 실행은 새 워커로 정상 동작한다", async () => {
    const started = Date.now();
    const outcome = await runner.run("def solution():\n    while True:\n        pass\n", [], {
      ...OPTIONS,
      timeoutMs: 500,
    });
    expect(outcome.kind).toBe("timeout");
    expect(Date.now() - started).toBeLessThan(3000);

    const next = await runner.run("def solution(a, b):\n    return a + b\n", [2, 3], OPTIONS);
    expect(next).toMatchObject({ kind: "ok", value: 5 });
  }, 60_000);

  it("실행 중 예외는 runtime 오류로 돌려준다", async () => {
    const outcome = await runner.run("def solution():\n    return [][1]\n", [], OPTIONS);
    expect(outcome).toMatchObject({ kind: "error", phase: "runtime", error: { type: "IndexError" } });
  }, 60_000);

  it("JS 브리지 모듈은 막혀 있다 (정적 검사를 우회해도)", async () => {
    const outcome = await runner.run("def solution():\n    import js\n    return js.process.env.HOME\n", [], OPTIONS);
    expect(outcome).toMatchObject({
      kind: "error",
      error: { type: expect.stringMatching(/ImportError|ModuleNotFoundError/) },
    });
  }, 60_000);

  describe("정적 검사", () => {
    it("허용된 import와 solution 정의는 통과", async () => {
      const code = "from collections import deque\nimport heapq\n\ndef solution(xs):\n    return list(deque(xs))\n";
      expect(await runner.check(code)).toEqual([]);
    }, 60_000);

    it.each([
      ["import os\ndef solution():\n    return 1\n", "허용되지 않은 import: os"],
      ["from subprocess import run\ndef solution():\n    return 1\n", "허용되지 않은 import: subprocess"],
      ["def solution():\n    return open('x').read()\n", "사용할 수 없는 함수 호출: open()"],
      ["def solution():\n    return ().__class__.__bases__\n", "던더 속성에 접근할 수 없어요: .__class__"],
      ["def solution():\n    return __import__('os')\n", "사용할 수 없는 함수 호출: __import__()"],
      ["def helper():\n    return 1\n", "최상위에 def solution(...) 함수가 없어요"],
      ["def solution(:\n", "문법 오류"],
    ])(
      "거부: %s",
      async (code, issue) => {
        const issues = await runner.check(code);
        expect(issues.some((text) => text.startsWith(issue))).toBe(true);
      },
      60_000,
    );
  });
});
