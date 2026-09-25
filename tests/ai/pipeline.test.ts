import { afterAll, describe, expect, it, vi } from "vitest";
import { MAX_ATTEMPTS, runGenerationPipeline, type DraftRequest } from "@/lib/ai/pipeline";
import { judge } from "@/lib/runner/judge";
import { runJsCase } from "@/lib/runner/harness-js";
import { createNodePythonRunner } from "@/lib/runner-node/node-runner";
import { DRAFT_REQUEST, REFERENCE_SOLUTION, validDraft } from "@/lib/ai/mock-draft";

const runner = createNodePythonRunner({ hashSeed: 0 });
const secondRunner = createNodePythonRunner({ hashSeed: 1 });
afterAll(async () => {
  await runner.dispose();
  await secondRunner.dispose();
});

/** 시도마다 준비한 초안을 차례로 돌려주는 가짜 LLM */
function scripted(...drafts: unknown[]) {
  const calls: DraftRequest[] = [];
  const draft = vi.fn(async (input: DraftRequest) => {
    calls.push(input);
    return drafts[Math.min(input.attempt - 1, drafts.length - 1)];
  });
  return { draft, calls };
}

const run = (drafts: unknown[]) => {
  const fake = scripted(...drafts);
  const statuses: string[] = [];
  const result = runGenerationPipeline("11111111-2222-3333-4444-555555555555", DRAFT_REQUEST, {
    draft: fake.draft,
    runner,
    secondRunner,
    onStatus: ({ status, attempt }) => statuses.push(`${attempt}:${status}`),
  });
  return { result, calls: fake.calls, statuses };
};

describe("AI 문제 생성 파이프라인", () => {
  it("정답 코드로 expected를 채워 검증된 문제를 만든다", async () => {
    const { result, statuses } = run([validDraft()]);
    const outcome = await result;
    expect(outcome.status).toBe("verified");
    if (outcome.status !== "verified") return;

    const { problem } = outcome;
    expect(statuses).toEqual(["1:generating", "1:verifying"]);
    expect(problem.id).toBe("g:11111111-2222-3333-4444-555555555555");
    expect(problem.source).toBe("generated");
    expect(problem.testCases.map((t) => t.id)).toEqual(["ex-1", "ex-2", "hid-1", "hid-2", "hid-3", "hid-4", "hid-5"]);
    expect(problem.testCases.map((t) => t.expected)).toEqual([2, 3, 1, 1, 4, 4, 1]);
    expect(problem.testCases[0]?.explanation).toBe("0-1-2와 3-4, 두 무리예요");
    expect(problem.testCases[2]?.failureNote).toBe("섬이 하나뿐이에요");
    // 모르는 신호 id는 버린다
    expect(problem.signalIds).toEqual(["sig-connected-group", "sig-relations-given"]);
    expect(problem.hints.map((h) => [h.step, h.kind, h.xpPenaltyRate])).toEqual([
      [1, "pattern", 0.05],
      [2, "approach", 0.15],
      [3, "pseudocode", 0.3],
      [4, "key-code", 0.5],
    ]);
    expect(problem.xp).toBe(30);
    // 문제 본문 어디에도 정답 코드가 들어가지 않는다
    expect(JSON.stringify(problem)).not.toContain("groups += 1\n        stack");
    expect(outcome.solution).toBe(REFERENCE_SOLUTION);
  }, 60_000);

  it("만들어진 문제는 JavaScript로도 풀린다 (사용자 제출과 같은 채점기)", async () => {
    const outcome = await run([validDraft()]).result;
    if (outcome.status !== "verified") throw new Error("verified여야 해요");
    const jsSolution = `function solution(n, links) {
      const parent = Array.from({ length: n }, (_, i) => i);
      const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
      for (const [a, b] of links) parent[find(a)] = find(b);
      return new Set(parent.map((_, i) => find(i))).size;
    }`;
    const result = await judge({
      problem: outcome.problem,
      mode: "submit",
      execute: async (args) => {
        const raw = runJsCase({ code: jsSolution, functionName: "solution", args, stdoutLimit: 1000 });
        return raw.ok
          ? { kind: "ok", value: raw.value, stdout: raw.stdout, timeMs: raw.timeMs }
          : { kind: "error", phase: raw.phase, error: raw.error, stdout: raw.stdout, timeMs: raw.timeMs };
      },
    });
    expect(result.verdict).toBe("accepted");
  }, 60_000);

  it("무한 루프 정답은 폐기하고, 사유를 붙여 다시 생성한다", async () => {
    const looping = validDraft({ referenceSolution: "def solution(n, links):\n    while True:\n        pass\n" });
    const { result, calls, statuses } = run([looping, validDraft()]);
    const outcome = await result;

    expect(outcome.status).toBe("verified");
    expect(outcome.attempts[0]).toMatchObject({ attempt: 1, stage: "execution", ok: false });
    expect(outcome.attempts[0]?.reason).toContain("끝나지 않음");
    expect(outcome.attempts[1]).toMatchObject({ attempt: 2, ok: true });
    expect(calls[1]?.previousFailure).toMatchObject({ stage: "execution" });
    expect(statuses).toEqual(["1:generating", "1:verifying", "2:generating", "2:verifying"]);
  }, 60_000);

  it("해시 시드에 따라 결과가 달라지는 정답은 결정성 검사에서 떨어진다", async () => {
    const unstable = validDraft({
      referenceSolution:
        "def solution(n, links):\n    names = {'apple', 'banana', 'cherry', 'durian', 'elder', 'fig', 'grape'}\n    return list(names)\n",
    });
    const outcome = await run([unstable, unstable, unstable]).result;
    expect(outcome.status).toBe("rejected");
    expect(outcome.attempts.map((a) => a.stage)).toEqual(["determinism", "determinism", "determinism"]);
  }, 60_000);

  it.each([
    [
      "허용되지 않은 import",
      validDraft({ referenceSolution: `import os\n${REFERENCE_SOLUTION}` }),
      "static-check",
      "허용되지 않은 import: os",
    ],
    [
      "인자 수가 params와 다름",
      validDraft({
        testInputs: validDraft().testInputs.map((t, i) => (i === 3 ? { ...t, argsJson: "[4]" } : t)),
      }),
      "schema",
      "인자 수(1)",
    ],
    ["스키마 위반", { ...validDraft(), hints: validDraft().hints.slice(0, 3) }, "schema", "hints"],
    [
      "알고리즘 이름 노출",
      validDraft({ statement: `${validDraft().statement}\n\nDFS로 풀어 보세요.` }),
      "quality",
      "알고리즘 이름",
    ],
    [
      "예제가 너무 적음",
      validDraft({
        testInputs: validDraft().testInputs.map((t, i) => (i === 1 ? { ...t, visibility: "hidden" as const } : t)),
      }),
      "quality",
      "예제 케이스는 2~3개",
    ],
    [
      "힌트 4가 전체 정답",
      validDraft({
        hints: [
          ...validDraft().hints.slice(0, 3),
          {
            title: "핵심 코드",
            body: "이렇게 하면 전체가 완성돼요. 그대로 써 보세요.",
            code: { python: REFERENCE_SOLUTION, javascript: "// 생략" },
          },
        ],
      }),
      "quality",
      "힌트 4",
    ],
    [
      "정답 코드 런타임 오류",
      validDraft({ referenceSolution: "def solution(n, links):\n    return links[99][0]\n" }),
      "execution",
      "IndexError",
    ],
  ])(
    "%s → %s 단계에서 거부",
    async (_label, draft, stage, reason) => {
      const outcome = await run([draft]).result;
      expect(outcome.status).toBe("rejected");
      expect(outcome.attempts).toHaveLength(MAX_ATTEMPTS);
      expect(outcome.attempts[0]?.stage).toBe(stage);
      expect(outcome.attempts[0]?.reason).toContain(reason);
      if (outcome.status === "rejected") expect(outcome.error).toContain("마지막 사유");
    },
    60_000,
  );
});
