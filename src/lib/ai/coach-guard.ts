import type { HintsOpened } from "@/types";

/**
 * AI 코치 답변을 스트리밍하면서 정답 유출을 막는 서버 가드.
 *
 * - 코드 블록(``` / ~~~)은 닫힐 때까지 모아 두었다가 검사한 뒤 내보낸다.
 * - 코드처럼 시작하는 줄(def, function, for …)은 줄 끝까지 모아서 검사한다.
 * - 나머지 글은 받는 즉시 내보낸다 (타이핑 효과 유지).
 *
 * 위반: solution 함수 정의가 들어 있거나, 사용자 코드에 없던 코드 줄이 허용량을 넘으면.
 * 사용자가 이미 쓴 코드를 그대로 인용한 줄은 세지 않는다.
 */

export type GuardViolationKind = "full-solution" | "too-much-code";

export interface GuardViolation {
  kind: GuardViolationKind;
  detail: string;
}

export interface GuardStep {
  /** 지금 사용자에게 보내도 되는 글 */
  emit: string;
  violation: GuardViolation | null;
}

/** 한 답변에 새로 보여 줄 수 있는 코드 줄 수. 의사코드 힌트(3단계) 전에는 더 적게 */
export function codeLineBudget(hintsOpened: HintsOpened): number {
  return hintsOpened >= 3 ? 3 : 2;
}

const FENCES = ["```", "~~~"] as const;
/** 줄 맨 앞에 오면 코드로 보는 시작어 */
const CODE_STARTS = [
  "def ",
  "class ",
  "function ",
  "async function",
  "const ",
  "let ",
  "var ",
  "import ",
  "from ",
  "return ",
  "for ",
  "for(",
  "while ",
  "while(",
  "if ",
  "if(",
  "elif ",
  "else:",
  "} else",
  "try:",
  "except",
  // Java
  "public ",
  "private ",
  "static ",
  "int ",
  "long ",
  "boolean ",
  "String ",
  "char ",
  "double ",
  "int[",
  "List<",
  "Map<",
  "Set<",
  "Deque<",
  "Queue<",
  "else {",
] as const;
const SPECIAL_STARTS: readonly string[] = [...FENCES, ...CODE_STARTS];

/** Python·JS의 solution 정의, Java의 solution 메서드 정의(반환 타입 + solution(...)) 또는 class Solution */
const SOLUTION_DEFINITION =
  /\b(def|function)\s+solution\s*\(|\bsolution\s*=\s*(function\b|\(|async\b)|\b(?!return\b)[\w>\]]+\s+solution\s*\([^)]*\)\s*\{|\bclass\s+Solution\b/;

function couldBeSpecial(trimmed: string): boolean {
  return SPECIAL_STARTS.some((start) => start.startsWith(trimmed) || trimmed.startsWith(start));
}

function isCodeStart(trimmed: string): boolean {
  return CODE_STARTS.some((start) => trimmed.startsWith(start));
}

export class CoachStreamGuard {
  private readonly budget: number;
  private readonly userLines: Set<string>;
  private codeLinesUsed = 0;
  /** 현재 줄에서 아직 내보내지 않은 글 */
  private held = "";
  /** 현재 줄을 이미 흘려보내는 중인지 (특수 줄이 아니라고 판정됨) */
  private streamingLine = false;
  private fence: { marker: string; text: string; lines: string[] } | null = null;
  private violation: GuardViolation | null = null;

  constructor({ hintsOpened, userCode }: { hintsOpened: HintsOpened; userCode: string }) {
    this.budget = codeLineBudget(hintsOpened);
    this.userLines = new Set(
      userCode
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    );
  }

  get tripped(): GuardViolation | null {
    return this.violation;
  }

  push(delta: string): GuardStep {
    let emit = "";
    for (const char of delta) {
      if (this.violation) break;
      emit += this.consume(char);
    }
    return { emit: this.violation ? "" : emit, violation: this.violation };
  }

  /** 스트림이 끝났을 때 남은 글을 검사해 내보낸다 */
  finish(): GuardStep {
    if (this.violation) return { emit: "", violation: this.violation };
    let emit = "";
    if (this.fence) {
      // 닫히지 않은 코드 블록도 코드로 검사한다
      emit = this.closeFence(this.fence.text);
    } else if (this.held) {
      emit = this.releaseLine(this.held);
    }
    this.held = "";
    return { emit: this.violation ? "" : emit, violation: this.violation };
  }

  private consume(char: string): string {
    if (this.fence) {
      this.fence.text += char;
      if (char !== "\n") return "";
      const line = this.fence.text.slice(0, -1).split("\n").at(-1) ?? "";
      if (line.trim().startsWith(this.fence.marker)) {
        return this.closeFence(this.fence.text);
      }
      this.fence.lines.push(line);
      return "";
    }

    if (this.streamingLine) {
      if (char === "\n") this.streamingLine = false;
      return char;
    }

    if (char === "\n") {
      const line = this.held;
      this.held = "";
      return this.releaseLine(line, true);
    }

    this.held += char;
    const trimmed = this.held.trimStart();
    if (trimmed === "" || couldBeSpecial(trimmed)) return "";
    // 특수 줄이 아니니 지금까지 모은 글을 내보내고 줄 끝까지 바로 흘려보낸다
    const out = this.held;
    this.held = "";
    this.streamingLine = true;
    return out;
  }

  /** 모아 둔 한 줄을 판정한다 */
  private releaseLine(line: string, withNewline = false): string {
    const trimmed = line.trim();
    const fence = FENCES.find((marker) => trimmed.startsWith(marker));
    if (fence && withNewline) {
      this.fence = { marker: fence, text: `${line}\n`, lines: [] };
      return "";
    }
    if (fence) {
      // 여는 표시만 있고 끝난 경우
      return line;
    }
    if (isCodeStart(trimmed)) this.countCode([trimmed]);
    if (this.violation) return "";
    return withNewline ? `${line}\n` : line;
  }

  private closeFence(text: string): string {
    const lines = this.fence?.lines ?? [];
    this.fence = null;
    this.countCode(lines.map((line) => line.trim()));
    return this.violation ? "" : text;
  }

  private countCode(lines: string[]) {
    const fresh = lines.filter((line) => line && !this.userLines.has(line));
    // 새로 쓴 solution 정의, 또는 사용자의 solution 머리줄 아래에 새 본문을 두 줄 이상 채운 경우
    const newDefinition = fresh.find((line) => SOLUTION_DEFINITION.test(line));
    const quotedDefinition = lines.find((line) => SOLUTION_DEFINITION.test(line));
    const definesSolution = newDefinition ?? (quotedDefinition && fresh.length >= 2 ? quotedDefinition : undefined);
    if (definesSolution) {
      this.violation = { kind: "full-solution", detail: `solution 함수 정의가 들어 있어요: ${definesSolution}` };
      return;
    }
    this.codeLinesUsed += fresh.length;
    if (this.codeLinesUsed > this.budget) {
      this.violation = {
        kind: "too-much-code",
        detail: `새 코드 ${this.codeLinesUsed}줄 (허용 ${this.budget}줄)`,
      };
    }
  }
}

/** 두 번 모두 막혔을 때 대신 보여 줄 답변 */
export const GUARD_FALLBACK_REPLY =
  "앗, 제가 답을 너무 많이 알려 줄 뻔했어요. 🌱 대신 이렇게 생각해 볼까요? 지금 코드에서 **어느 줄까지는 확실히 맞다**고 말할 수 있나요? 그 다음 줄에서 무엇을 해야 하는지 한 문장으로 적어 보면, 제가 그 생각이 맞는지 같이 봐 드릴게요.";
