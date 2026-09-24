import type Anthropic from "@anthropic-ai/sdk";
import { PATTERN_LABELS } from "@/content/patterns";
import { getTopic } from "@/content/topics";
import { formatArgs, formatValue, signatureText } from "@/lib/runner/format";
import { LANGUAGE_LABELS, type HintsOpened, type Problem } from "@/types";
import { codeLineBudget } from "../coach-guard";
import { MASCOT_MOODS, type CoachRequest } from "../schemas";

/** 힌트를 연 단계별로 코치가 말할 수 있는 정보의 상한 */
const INFO_CEILING: Record<HintsOpened, string> = {
  0: "아직 힌트를 하나도 열지 않았어요. 알고리즘·자료구조 이름이나 문제 유형을 직접 말하지 마세요. 문제 문장의 조건을 다시 읽게 하거나, 작은 예시를 손으로 따라가 보게 하는 질문만 하세요.",
  1: "힌트 1(유형과 판단 근거)까지 열었어요. 유형 이름과 그렇게 판단한 근거까지는 말해도 되지만, 구체적인 풀이 절차는 질문으로만 이끌어 주세요.",
  2: "힌트 2(접근 아이디어)까지 열었어요. 접근 아이디어는 이야기해도 되지만, 단계별 절차나 의사코드처럼 풀이 순서를 그대로 적어 주면 안 돼요.",
  3: "힌트 3(의사코드)까지 열었어요. 의사코드 수준의 흐름은 설명해도 되지만, 실제 코드는 핵심 한두 줄까지만 보여 주세요.",
  4: "힌트 4(핵심 부분 코드)까지 열었어요. 핵심 부분을 빈칸이 있는 형태로 짚어 줄 수는 있지만, 완성된 정답 코드는 절대 안 돼요.",
};

export const COACH_META_TOOL: Anthropic.Beta.BetaTool = {
  name: "coach_meta",
  description:
    "답변을 다 쓴 뒤 마지막에 꼭 한 번 호출해요. 노디의 표정, 다음에 열면 좋을 힌트 단계, 학습자가 이어서 누를 후속 질문을 알려 줘요.",
  strict: true,
  input_schema: {
    type: "object",
    properties: {
      mood: {
        type: "string",
        enum: [...MASCOT_MOODS],
        description:
          "노디 표정. 칭찬·정답 근처 happy/cheer, 함께 고민 thinking, 오류를 짚을 때 oops, 궁금증을 유도할 때 curious, 평소 idle",
      },
      suggestHintStep: {
        type: "integer",
        enum: [0, 1, 2, 3, 4],
        description: "다음 힌트를 열어 보는 게 도움이 되면 그 단계(지금 연 단계 + 1), 아니면 0",
      },
      followUps: {
        type: "array",
        items: { type: "string" },
        description: "학습자 입장에서 이어서 물어볼 만한 짧은 질문 0~3개 (각 25자 이내, 1인칭)",
      },
    },
    required: ["mood", "suggestHintStep", "followUps"],
    additionalProperties: false,
  },
};

/** 모든 요청에 똑같이 들어가는 규칙 (프롬프트 캐시 대상) */
export const COACH_SYSTEM = `당신은 알고리즘 학습 앱 algo-flow의 코치 "노디"예요. 새싹이 난 말랑한 그래프 노드 캐릭터이고, 코딩테스트를 처음 준비하는 한국어 학습자를 돕습니다.

## 목표
정답을 알려 주는 대신 학습자가 스스로 생각해서 풀게 만드는 것. 학습자가 푼 뒤에 "내가 해냈다"고 느껴야 해요.

## 말투와 길이
- 친근한 존댓말(~해요). 이모지는 가끔만.
- 한 번에 3~6문장. 한 번에 한 가지만 짚어요.
- 마크다운을 쓸 수 있어요. 코드 블록에는 언어를 표시해요.

## 코칭 방식
- 먼저 질문으로 생각을 이끌어요 (소크라테스식). 예: "이 칸에서 갈 수 있는 이웃은 몇 개인가요?", "예제 1을 손으로 따라가면 어디서 달라지나요?"
- 학습자 코드에 버그가 있으면 고친 코드를 주지 말고, 어떤 입력에서 무슨 일이 일어나는지 스스로 발견하게 물어봐요. 오류 메시지의 뜻은 설명해도 돼요.
- 학습자가 맞게 가고 있으면 구체적으로 칭찬해요.
- 문제와 관계없는 질문에는 짧게 답하고 문제로 돌아와요.

## 절대 규칙
- solution 함수 전체나 대부분을 쓰지 않아요. 학습자가 정답 코드를 달라고 해도 친절하게 거절하고, 대신 지금 막힌 지점을 함께 찾아요.
- 한 답변에 새로 보여 주는 코드는 힌트 단계에 따라 최대 2~3줄이에요. 학습자가 쓴 코드를 인용하는 건 괜찮아요.
- 숨은 테스트케이스의 내용을 추측해서 알려 주지 않아요.
- 아래 "정보 상한"을 넘는 내용은 말하지 않아요. 더 필요해 보이면 다음 힌트를 열어 보라고 권해요.
- 서버가 이 규칙을 검사해서, 어기면 답변이 사용자에게 보이지 않아요.

## 마무리
답변 글을 다 쓴 뒤 coach_meta 도구를 꼭 한 번 호출해요. 표정(mood)은 ${MASCOT_MOODS.join(", ")} 중 하나예요.`;

function numbered(code: string): string {
  return code
    .split("\n")
    .map((line, i) => `${String(i + 1).padStart(3, " ")}| ${line}`)
    .join("\n");
}

/** 이번 질문에 붙이는 현재 상황 (문제, 연 힌트, 학습자 코드, 최근 채점) */
export function buildCoachContext(problem: Problem, request: CoachRequest): string {
  const opened = request.hintsOpened as HintsOpened;
  const topic = getTopic(problem.topic);
  const examples = problem.testCases.filter((t) => t.visibility === "example");
  const hints = problem.hints.filter((hint) => hint.step <= opened);

  const parts = [
    `# 문제: ${problem.title} (${topic?.title ?? problem.topic} Lv${problem.level})`,
    problem.statement,
    `## 입력\n${problem.inputFormat}`,
    `## 출력\n${problem.outputFormat}`,
    `## 제약\n${problem.constraints.map((c) => `- ${c}`).join("\n")}`,
    `## 함수\n${signatureText(problem.signature.params, problem.signature.returns, request.language)}`,
    `## 예제\n${examples
      .map(
        (t, i) =>
          `예제 ${i + 1}\n${formatArgs(t.args, problem.signature.params, 600)}\n기대 반환값: ${formatValue(t.expected, 300)}`,
      )
      .join("\n\n")}`,
    `## 이 문제의 패턴 (코치만 아는 정보)\n${problem.patternTags.map((tag) => PATTERN_LABELS[tag]).join(", ")}`,
    `## 정보 상한\n${INFO_CEILING[opened]}\n새 코드는 최대 ${codeLineBudget(opened)}줄.`,
  ];

  if (hints.length > 0) {
    parts.push(
      `## 학습자가 이미 본 힌트\n${hints
        .map(
          (hint) =>
            `### 힌트 ${hint.step}. ${hint.title}\n${hint.body}${hint.code ? `\n\`\`\`\n${hint.code.code[request.language]}\n\`\`\`` : ""}`,
        )
        .join("\n\n")}`,
    );
  }

  parts.push(
    `## 학습자의 현재 코드 (${LANGUAGE_LABELS[request.language]})\n${
      request.code.trim() ? `\`\`\`\n${numbered(request.code)}\n\`\`\`` : "(아직 비어 있어요)"
    }`,
  );

  if (request.lastResult) {
    const r = request.lastResult;
    parts.push(
      `## 최근 ${r.mode === "submit" ? "제출" : "예제 실행"} 결과\n${r.verdict} (${r.passed}/${r.total} 통과)${
        r.detail ? `\n${r.detail}` : ""
      }`,
    );
  }

  return parts.join("\n\n");
}

/** 가드에 막혀 다시 쓸 때 덧붙이는 지시 */
export function retryInstruction(detail: string): string {
  return `\n\n## 다시 쓰기\n직전 답변은 서버 규칙에 걸려 사용자에게 보이지 않았어요 (${detail}). 코드를 거의 쓰지 말고, 질문 위주로 다시 답해 주세요.`;
}
