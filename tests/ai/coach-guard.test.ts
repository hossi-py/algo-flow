import { describe, expect, it } from "vitest";
import { CoachStreamGuard, codeLineBudget } from "@/lib/ai/coach-guard";
import type { HintsOpened } from "@/types";

/** 글을 작은 조각으로 나눠 흘려보내며 가드를 통과시킨다 */
function stream(text: string, { hintsOpened = 0 as HintsOpened, userCode = "", chunk = 3 } = {}) {
  const guard = new CoachStreamGuard({ hintsOpened, userCode });
  let shown = "";
  const emits: string[] = [];
  for (let i = 0; i < text.length; i += chunk) {
    const step = guard.push(text.slice(i, i + chunk));
    shown += step.emit;
    emits.push(step.emit);
    if (step.violation) return { shown, violation: step.violation, emits };
  }
  const end = guard.finish();
  shown += end.emit;
  return { shown, violation: end.violation, emits };
}

describe("코치 스트림 가드", () => {
  it("평범한 설명은 그대로, 받자마자 내보낸다", () => {
    const text = "좋아요! 지금 방문 표시를 언제 하고 있나요?\n- 들어가자마자\n- 나올 때\n어느 쪽일까요?";
    const { shown, violation, emits } = stream(text);
    expect(violation).toBeNull();
    expect(shown).toBe(text);
    // 첫 조각부터 바로 보인다 (타이핑 효과)
    expect(emits[0]).toBe("좋아요");
  });

  it("짧은 코드 조각은 허용한다", () => {
    const text = "이 줄을 보세요:\n```python\nvisited[r][c] = True\n```\n언제 실행될까요?";
    const { shown, violation } = stream(text);
    expect(violation).toBeNull();
    expect(shown).toBe(text);
  });

  it("solution 함수 정의가 나오면 막는다 (코드 블록)", () => {
    const text = "정답은 이래요:\n```python\ndef solution(garden):\n    return []\n```";
    const { shown, violation } = stream(text, { hintsOpened: 4 });
    expect(violation?.kind).toBe("full-solution");
    // 코드 블록은 한 글자도 새지 않는다
    expect(shown).toBe("정답은 이래요:\n");
  });

  it("코드 블록 없이 쓴 solution 정의도 막는다", () => {
    const { shown, violation } = stream("이렇게 써 보세요\nfunction solution(garden) {\n  return [];\n}\n", {
      hintsOpened: 4,
    });
    expect(violation?.kind).toBe("full-solution");
    expect(shown).not.toContain("function solution");
  });

  it("허용 줄 수를 넘는 코드는 막는다 (힌트 단계별 한도)", () => {
    const code =
      "```python\nfor dr, dc in DIRS:\n    nr, nc = r + dr, c + dc\n    if 0 <= nr < n:\n        size += dfs(nr, nc)\n```";
    expect(stream(code, { hintsOpened: 2 }).violation?.kind).toBe("too-much-code");
    expect(stream(code, { hintsOpened: 4 }).violation?.kind).toBe("too-much-code");
    const three = "```python\nfor dr, dc in DIRS:\n    nr, nc = r + dr, c + dc\n    size += dfs(nr, nc)\n```";
    expect(stream(three, { hintsOpened: 2 }).violation?.kind).toBe("too-much-code");
    expect(stream(three, { hintsOpened: 3 }).violation).toBeNull();
    expect(codeLineBudget(0)).toBe(2);
    expect(codeLineBudget(3)).toBe(3);
  });

  it("여러 코드 블록의 줄 수를 합산한다", () => {
    const text = "```\na = 1\nb = 2\n```\n그리고\n```\nc = 3\n```";
    expect(stream(text, { hintsOpened: 0 }).violation?.kind).toBe("too-much-code");
  });

  it("사용자가 이미 쓴 코드를 인용한 줄은 세지 않는다", () => {
    const userCode =
      "def solution(garden):\n    n = len(garden)\n    m = len(garden[0])\n    visited = []\n    return visited\n";
    const text =
      "여기를 보세요:\n```python\ndef solution(garden):\n    n = len(garden)\n    m = len(garden[0])\n    visited = []\n```\nvisited의 크기가 맞나요?";
    const { violation, shown } = stream(text, { userCode });
    expect(violation).toBeNull();
    expect(shown).toBe(text);
  });

  it("글 속의 인라인 코드나 코드처럼 시작하지만 한국어인 줄은 막지 않는다", () => {
    const text = "`solution` 함수 안에서 for문을 쓰면 돼요.\nfor문 대신 while도 괜찮아요.\nif문 조건을 확인해 보세요.";
    const { violation, shown } = stream(text, { chunk: 1 });
    expect(violation).toBeNull();
    expect(shown).toBe(text);
  });

  it("닫히지 않은 코드 블록도 끝에서 검사한다", () => {
    const { violation } = stream("```python\ndef solution(x):\n    return x", { hintsOpened: 4 });
    expect(violation?.kind).toBe("full-solution");
  });
});

describe("코치 스트림 가드 — 사용자 머리줄 재사용", () => {
  it("사용자의 solution 머리줄 아래에 새 본문을 채우면 전체 정답으로 본다", () => {
    const userCode = "def solution(garden):\n    answer = []\n    return answer\n";
    const text = "```python\ndef solution(garden):\n    visited = set()\n    return sorted(sizes)\n```\n";
    expect(stream(text, { userCode, hintsOpened: 4 }).violation?.kind).toBe("full-solution");
  });

  it("머리줄을 인용하며 한 줄만 짚는 건 괜찮다", () => {
    const userCode = "def solution(garden):\n    answer = []\n    return answer\n";
    const text = "```python\ndef solution(garden):\n    answer = []   # 여기서 구역 크기를 담아요\n```\n";
    expect(stream(text, { userCode, hintsOpened: 1 }).violation).toBeNull();
  });
});
