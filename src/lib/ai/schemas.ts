import { z } from "zod";
import { LANGUAGES, PATTERN_TAGS, TOPIC_SLUGS } from "@/types";

/** Python·JS 양쪽에서 쓸 수 있는 변수명 (snake_case) */
const identifier = z.string().regex(/^[a-z_][a-z0-9_]*$/, "영문 소문자, 숫자, _ 로만 된 변수명이어야 해요");

/**
 * LLM에게 받는 문제 초안. 기대 출력(expected)은 LLM이 쓰지 않고 검증 파이프라인이 정답 코드를 실행해 채운다.
 * 인자는 재귀 JSON 스키마 대신 argsJson 문자열로 받고 파싱 단계에서 검증한다.
 */
export const problemDraftSchema = z.object({
  title: z.string().min(2).max(30).describe("한국어 문제 제목, 30자 이내"),
  summary: z.string().min(5).max(80).describe("문제 목록에 보일 한 줄 요약"),
  statement: z
    .string()
    .min(80)
    .describe("마크다운 문제 설명. 짧은 스토리와 요구사항. 풀이 방법이나 알고리즘 이름을 직접 쓰지 말 것"),
  inputFormat: z.string().min(5).describe("solution 함수 인자 설명"),
  outputFormat: z.string().min(5).describe("반환값 설명"),
  constraints: z
    .array(z.string())
    .min(1)
    .max(8)
    .describe("입력 크기 등 제약 조건. 모든 정수 값과 결과는 -2^53 ~ 2^53 범위 (JS 호환)"),
  params: z
    .array(
      z.object({
        name: identifier,
        type: z.object({
          python: z.string().describe("Python 타입 힌트. 예: list[list[int]]"),
          javascript: z.string().describe("TypeScript 표기. 예: number[][]"),
        }),
        description: z.string(),
      }),
    )
    .min(1)
    .max(4),
  returns: z.object({
    type: z.object({ python: z.string(), javascript: z.string() }),
    description: z.string(),
  }),
  compare: z.enum(["exact", "unordered"]).describe("반환 리스트의 순서가 상관없으면 unordered"),
  referenceSolution: z
    .string()
    .min(30)
    .describe(
      "def solution(...)을 포함한 완전한 Python 3 코드. import는 collections, heapq, itertools, math, functools, bisect만 허용. input/print/파일 접근 금지",
    ),
  testInputs: z
    .array(
      z.object({
        argsJson: z.string().describe('solution에 전달할 인자 배열의 JSON. 예: [["110", "011"]]'),
        visibility: z.enum(["example", "hidden"]),
        purpose: z.enum(["basic", "edge", "tricky", "stress"]),
        note: z.string().describe("이 케이스가 확인하는 것. 예: 대각선은 연결이 아님"),
      }),
    )
    .min(6)
    .max(16)
    .describe("example 2~3개, 나머지는 hidden. 경계값과 최대 크기 케이스 포함"),
  patternTags: z.array(z.enum(PATTERN_TAGS)).min(1).max(3),
  signalIds: z.array(z.string()).max(3).describe("제공된 신호 목록 중 이 문제에 해당하는 id"),
  hints: z
    .array(
      z.object({
        title: z.string().max(30),
        body: z.string().min(20),
        code: z
          .object({ python: z.string(), javascript: z.string() })
          .nullable()
          .describe("같은 코드 조각을 Python과 JavaScript로 각각 작성"),
      }),
    )
    .length(4)
    .describe("[0] 유형과 판단 근거 [1] 접근 아이디어 [2] 의사코드 [3] 핵심 부분 코드(빈칸 포함, 전체 정답 금지)"),
  estimatedMinutes: z.number().int().min(5).max(60),
});
export type ProblemDraft = z.infer<typeof problemDraftSchema>;

export const MASCOT_MOODS = ["idle", "happy", "cheer", "thinking", "oops", "sleepy", "curious", "loading"] as const;

/** AI 코치 응답과 함께 받는 메타데이터 */
export const coachMetaSchema = z.object({
  mood: z.enum(MASCOT_MOODS),
  /** 다음에 열어보면 좋을 힌트 단계. 추천하지 않으면 null */
  suggestHintStep: z.number().int().min(1).max(4).nullable(),
  /** 사용자에게 보여줄 후속 질문 버튼 (최대 3개) */
  followUps: z.array(z.string().max(40)).max(3),
});
export type CoachMeta = z.infer<typeof coachMetaSchema>;

const problemKey = z.string().regex(/^(c|g):[A-Za-z0-9_-]{1,80}$/, "문제 키 형식이 올바르지 않아요");

export const COACH_HISTORY_TURNS = 10;
export const COACH_MESSAGE_MAX = 1000;
export const CODE_MAX = 20_000;

/** POST /api/coach 요청 본문 */
export const coachRequestSchema = z.object({
  problemKey,
  hintsOpened: z.number().int().min(0).max(4),
  language: z.enum(LANGUAGES),
  code: z.string().max(CODE_MAX),
  /** 최근 채점 요약 (없으면 null) */
  lastResult: z
    .object({
      mode: z.enum(["run", "submit"]),
      verdict: z.enum([
        "accepted",
        "wrong-answer",
        "runtime-error",
        "time-limit-exceeded",
        "syntax-error",
        "internal-error",
      ]),
      passed: z.number().int().min(0),
      total: z.number().int().min(0),
      /** 공개된 첫 실패 케이스·오류 설명 (이미 사용자에게 보인 정보만) */
      detail: z.string().max(2000).nullable(),
    })
    .nullable(),
  /** 마지막 요소가 이번 질문 */
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(4000) }))
    .min(1)
    .max(COACH_HISTORY_TURNS * 2 + 1)
    .refine((list) => list.at(-1)?.role === "user", "마지막 메시지는 질문이어야 해요")
    .refine((list) => (list.at(-1)?.content.length ?? 0) <= COACH_MESSAGE_MAX, "질문이 너무 길어요"),
});
export type CoachRequest = z.infer<typeof coachRequestSchema>;

/** 스트리밍 응답의 한 줄 (NDJSON) */
export type CoachStreamEvent =
  | { type: "text"; delta: string }
  /** 서버 가드가 답변을 막아서 다시 쓰는 중: 지금까지 받은 글을 지운다 */
  | { type: "reset"; reason: string }
  | { type: "meta"; meta: CoachMeta }
  | { type: "error"; message: string }
  | { type: "done" };

export const THEME_MAX = 20;

/** POST /api/generate 요청 본문 */
export const generationRequestSchema = z.object({
  topic: z.enum(TOPIC_SLUGS),
  level: z.union([z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  focusPatterns: z.array(z.enum(PATTERN_TAGS)).max(3),
  weakSignalIds: z.array(z.string().max(60)).max(5),
  theme: z
    .string()
    .trim()
    .max(THEME_MAX, `테마는 ${THEME_MAX}자 이내로 적어 주세요`)
    .regex(/^[\p{L}\p{N} ]*$/u, "테마에는 글자·숫자·띄어쓰기만 쓸 수 있어요")
    .optional(),
});
