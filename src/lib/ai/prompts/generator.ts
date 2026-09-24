import { PATTERN_LABELS } from "@/content/patterns";
import { flowerZones } from "@/content/problems/dfs/flower-zones";
import { SIGNALS } from "@/content/signals";
import { getTopic } from "@/content/topics";
import { LEVEL_STAGE_LABELS, LEVEL_STAGES, type GenerationRequest, type VerificationStage } from "@/types";
import { ALLOWED_MODULES } from "../static-check";

/** 스타일 예시: 큐레이션 문제 「꽃밭 구역 나누기」의 설명과 힌트 */
function styleExample(): string {
  const example = flowerZones;
  return [
    `제목: ${example.title}`,
    `요약: ${example.summary}`,
    `설명:\n${example.statement}`,
    `입력: ${example.inputFormat}`,
    `출력: ${example.outputFormat}`,
    `제약: ${example.constraints.join(" / ")}`,
    ...example.hints.map(
      (hint) =>
        `힌트 ${hint.step} (${hint.kind}) — ${hint.title}\n${hint.body}${hint.code ? `\n[python]\n${hint.code.code.python}` : ""}`,
    ),
  ].join("\n\n");
}

/** 모든 생성 요청에 똑같이 들어가는 규칙 (프롬프트 캐시 대상) */
export const GENERATOR_SYSTEM = `당신은 알고리즘 학습 앱 algo-flow의 문제 출제자예요. 코딩테스트를 처음 준비하는 한국어 학습자를 위해, 요청받은 토픽·레벨·패턴에 맞는 오리지널 문제를 하나 만들어요.

## 출력
지정된 JSON 스키마 하나로만 답해요. 모든 글은 한국어(친근한 존댓말, ~해요)로 써요.

## 문제 형식
- 함수형 채점이에요. 학습자는 solution(...) 함수를 완성하고, 반환값을 기대값과 비교해요. 입력 파싱·출력(print)은 없어요.
- 인자와 반환값은 JSON으로 표현할 수 있어야 해요: 정수, 실수, 문자열, bool, null, 리스트, 문자열 키 딕셔너리. 튜플·집합 대신 리스트를 써요.
- 모든 정수(입력과 결과)는 -2^53 ~ 2^53 범위여야 해요 (JavaScript로도 풀기 때문).
- 반환 리스트의 순서가 정해져 있지 않으면 compare를 "unordered"로 하거나, 정렬해서 반환하라고 문제에 명시해요.
- 답이 하나로 정해지지 않는 문제(여러 정답 허용)는 만들지 않아요.

## 문제 설명 (statement)
- 짧은 스토리(노디나 일상 소재) + 요구사항을 마크다운으로. 학습자가 유형을 스스로 알아차려야 하므로 알고리즘·자료구조 이름이나 풀이 방법(DFS, BFS, 스택을 사용해 등)을 제목·요약·설명에 쓰지 말아요.
- 대신 그 유형을 의심하게 만드는 표현(신호)이 자연스럽게 들어가게 써요.
- 기존 코딩테스트 사이트의 문제를 베끼지 말고, 완전히 새로운 상황을 만들어요.

## 제약과 크기
- 정답 코드가 테스트 하나를 0.5초 안에 끝낼 수 있는 크기로 제약을 정해요. Python 재귀 깊이는 1,000 이하가 되게 해요.
- constraints에는 입력 크기와 값의 범위를 구체적으로 적어요.

## 정답 코드 (referenceSolution)
- def solution(...)을 최상위에 정의한 완전한 Python 3 코드. 결정적이어야 해요 (무작위, 시간, set·dict 순서에 따라 결과가 바뀌면 안 돼요).
- import는 ${ALLOWED_MODULES.join(", ")}만 쓸 수 있어요. input, print, open, eval, exec, 파일·네트워크 접근은 금지예요.
- 이 코드는 서버에서 실행돼 테스트 기대값을 만들어요. 기대값은 당신이 쓰지 않아요.

## 테스트 입력 (testInputs)
- 6~16개. example 2~3개(설명용, 손으로 따라갈 수 있게 작게), 나머지는 hidden.
- 경계값(edge: 가장 작은 입력, 빈 경우 등), 함정(tricky: 흔한 실수를 잡는 입력), 최대 크기 근처(stress) 케이스를 포함해요.
- 서로 다른 답이 나오는 입력을 섞어요. 같은 입력을 반복하지 않아요.
- argsJson은 solution에 넘길 인자 배열의 JSON이에요. 인자 수는 params 수와 같아야 해요. 큰 입력도 실제 값을 전부 적어야 해요 (코드나 줄임표 금지).
- note에는 그 케이스가 확인하는 것을 한 문장으로 써요 (example은 해설, hidden은 틀렸을 때 보여 줄 짧은 설명).

## 힌트 4단계 (순서 고정)
1. 유형과 판단 근거: 어떤 유형인지, 문제의 어느 표현이 그 신호인지.
2. 접근 아이디어: 무엇을 기록하고 어떤 순서로 볼지. 코드는 쓰지 않아요.
3. 의사코드: 전체 흐름을 한국어 의사코드로 (~~~text 코드 블록).
4. 핵심 부분 코드: 가장 실수하기 쉬운 부분만, 빈칸(______)을 남긴 Python과 JavaScript 코드. 전체 정답 코드는 절대 안 돼요.
code 필드는 힌트 4에만 쓰고, 나머지는 null로 둬요.

## 스타일 예시 (기존 문제, 그대로 베끼지 말 것)
${styleExample()}`;

/** 이번 요청의 조건 (+ 직전 시도가 떨어진 이유) */
export function buildGeneratorRequest(
  request: GenerationRequest,
  previousFailure: { stage: VerificationStage; reason: string } | null,
): string {
  const topic = getTopic(request.topic);
  const level = topic?.levels[request.level - 1];
  const stage = LEVEL_STAGE_LABELS[LEVEL_STAGES[request.level]];
  const focus = request.focusPatterns;
  const signals = SIGNALS.filter((signal) => signal.suspects.includes(request.topic));
  const weakSignals = SIGNALS.filter((signal) => request.weakSignalIds.includes(signal.id));

  const lines = [
    "# 만들 문제",
    `- 토픽: ${topic?.title ?? request.topic} — ${topic?.tagline ?? ""}`,
    `- 레벨: Lv${request.level} (${stage})${level ? ` · 이 레벨의 목표: ${level.goal}` : ""}`,
    focus.length > 0
      ? `- 집중 패턴: ${focus.map((tag) => `${PATTERN_LABELS[tag]}(${tag})`).join(", ")} — patternTags에 반드시 포함`
      : "- 집중 패턴: 자유 (이 토픽의 대표 패턴 중 하나)",
    request.theme ? `- 스토리 테마: ${request.theme}` : "- 스토리 테마: 자유",
    "",
    "# 사용할 수 있는 신호 (signalIds는 이 목록의 id 중에서만)",
    ...signals.map((signal) => `- ${signal.id}: ${signal.phrase}`),
  ];
  if (weakSignals.length > 0) {
    lines.push("", "# 학습자가 잘 못 알아차리는 신호 (문제 설명에 자연스럽게 녹여 주세요)");
    lines.push(...weakSignals.map((signal) => `- ${signal.id}: ${signal.phrase}`));
  }
  if (previousFailure) {
    lines.push(
      "",
      "# 직전 시도가 검증에서 떨어졌어요",
      `- 단계: ${previousFailure.stage}`,
      `- 사유: ${previousFailure.reason}`,
      "이 문제를 고친 새 초안을 처음부터 다시 작성해 주세요.",
    );
  }
  return lines.join("\n");
}
