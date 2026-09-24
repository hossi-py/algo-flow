import { describe, expect, it } from "vitest";
import { hasJdk, runJavaBatch } from "../../scripts/java-tools";
import { PROBLEMS } from "@/content/problems";
import { signatureText } from "@/lib/runner/format";
import { hasLanguage, LANGUAGES } from "@/types";

describe("Java 표기", () => {
  it("Java 시그니처는 메서드 선언 모양으로 보여 준다", () => {
    const problem = PROBLEMS.find((p) => p.slug === "dfs-flower-zones");
    if (!problem) throw new Error("문제가 없어요");
    expect(signatureText(problem.signature.params, problem.signature.returns, "java")).toBe(
      "public List<Integer> solution(String[] garden)",
    );
  });

  it("Java가 없는 값(AI 생성 문제 등)은 Java를 고를 수 없다", () => {
    const map = { python: "def solution(): pass", javascript: "function solution() {}" };
    expect(LANGUAGES.filter((l) => hasLanguage(map, l))).toEqual(["python", "javascript"]);
  });
});

// 진짜 JDK가 있을 때만: 브라우저와 같은 Java 하네스(public/java/algoflow-runner.jar)의 동작을 확인한다
describe.skipIf(!hasJdk())("Java 하네스 (JDK)", () => {
  it("인자를 매개변수 타입대로 바꾸고, 반환값을 JSON으로 돌려준다", () => {
    const code = [
      "import java.util.*;",
      "class Solution {",
      "    public Map<String, Object> solution(int n, long big, int[][] edges, List<String> names, Object[] mixed) {",
      '        System.out.println("안녕 " + n);',
      "        Map<String, Object> out = new LinkedHashMap<>();",
      '        out.put("sum", n + big);',
      '        out.put("edges", edges.length);',
      '        out.put("first", names.get(0));',
      '        out.put("mixed", (String) mixed[0] + (int) mixed[1]);',
      '        out.put("flags", new boolean[] {true, false});',
      "        return out;",
      "    }",
      "}",
    ].join("\n");
    const [result] = runJavaBatch(code, [[3, 10_000_000_000, [[0, 1]], ["노디"], ["김밥", 2]]]);
    expect(result).toMatchObject({
      ok: true,
      value: { sum: 10_000_000_003, edges: 1, first: "노디", mixed: "김밥2", flags: [true, false] },
      stdout: "안녕 3\n",
    });
  });

  it("문법 오류는 compile 단계 오류로, 줄 번호와 함께", () => {
    const [result] = runJavaBatch("class Solution {\n  int solution(int n) {\n    return n +;\n  }\n}\n", [[1]]);
    expect(result).toMatchObject({ ok: false, phase: "compile", error: { type: "CompileError", line: 3 } });
  });

  it("실행 중 예외는 runtime 오류로, 사용자 코드의 줄 번호와 함께", () => {
    const code = "class Solution {\n  int solution(int n) {\n    int[] a = new int[1];\n    return a[n];\n  }\n}\n";
    const [result] = runJavaBatch(code, [[5]]);
    expect(result).toMatchObject({
      ok: false,
      phase: "runtime",
      error: { type: "ArrayIndexOutOfBoundsException", line: 4 },
    });
  });

  it("int 범위를 넘는 입력을 int로 받으면 long을 쓰라고 안내한다", () => {
    const [result] = runJavaBatch("class Solution {\n  int solution(int n) { return n; }\n}\n", [[10_000_000_000]]);
    expect(result).toMatchObject({ ok: false, error: { type: "TypeError" } });
    expect(result?.ok === false && result.error.message).toContain("long");
  });

  it("Solution 클래스나 solution 메서드가 없으면 알려 준다", () => {
    const [result] = runJavaBatch("class Answer {\n  int solution() { return 1; }\n}\n", [[]]);
    expect(result).toMatchObject({ ok: false, error: { type: "NameError" } });
  });
});
