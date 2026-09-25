import type {
  BadgeId,
  HintStep,
  IsoDateTime,
  JudgeResult,
  Language,
  LocalDate,
  PatternStat,
  Problem,
  SubmissionSummary,
  Topic,
  UserProgress,
} from "@/types";
import { cardAction, hintAction, quizAction, submitAction, type ConceptResult } from "./actions";
import { awardBadges } from "./badges";
import type { ConceptOutcome } from "./concept";
import { mergeProgress } from "./merge";
import { isEmptyChanges, progressChanges, submissionToRow, type ProgressChanges, type SubmissionRow } from "./rows";
import type { SubmissionOutcome } from "./submission";

/**
 * 로그인 사용자의 진도 쓰기 (서버 전용 규칙 실행).
 * 현재 진도를 읽고 → TS 규칙으로 새 진도를 계산하고 → 바뀐 행만 RPC 한 번(한 트랜잭션)으로 기록한다.
 * 그 사이 다른 요청이 먼저 썼으면 revision 충돌이 나고, 다시 읽어서 계산한다.
 */

export class RevisionConflictError extends Error {
  constructor() {
    super("revision_conflict");
  }
}

export interface ProgressSnapshot {
  progress: UserProgress;
  revision: number;
}

/** Supabase(서비스 키)나 테스트용 DB가 구현한다 */
export interface ProgressRepository {
  load(userId: string): Promise<ProgressSnapshot>;
  recordSubmission(
    userId: string,
    revision: number,
    submission: SubmissionRow,
    changes: ProgressChanges,
  ): Promise<number>;
  recordConcept(userId: string, revision: number, changes: ProgressChanges): Promise<number>;
  recordProblemState(userId: string, revision: number, changes: ProgressChanges): Promise<number>;
  mergeGuest(userId: string, revision: number, changes: ProgressChanges, submissions: SubmissionRow[]): Promise<number>;
  listSubmissions(userId: string, limit: number): Promise<SubmissionSummary[]>;
  patternStats(userId: string): Promise<PatternStat[]>;
}

const MAX_TRIES = 3;

async function withRetry<T>(run: () => Promise<T>): Promise<T> {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await run();
    } catch (error) {
      if (!(error instanceof RevisionConflictError) || attempt >= MAX_TRIES) throw error;
    }
  }
}

/** 제출 결과 중 서버에 남길 부분 */
export interface SubmissionPayload {
  verdict: JudgeResult["verdict"];
  passed: number;
  total: number;
  runtimeMs: number | null;
  language: Language;
  code: string;
  results: JudgeResult["results"];
}

export interface SubmitForUserResult {
  progress: UserProgress;
  outcome: SubmissionOutcome;
  earnedBadges: BadgeId[];
}

export async function submitForUser(
  repo: ProgressRepository,
  userId: string,
  problem: Problem,
  payload: SubmissionPayload,
  topics: readonly Topic[],
  clock: { today: LocalDate; now: IsoDateTime },
): Promise<SubmitForUserResult> {
  return withRetry(async () => {
    const { progress, revision } = await repo.load(userId);
    // 엔진 오류는 시도로 세지 않고 기록하지도 않는다
    if (payload.verdict === "internal-error") {
      return {
        progress,
        outcome: { firstSolve: false, xpAwarded: 0, levelCleared: null, unlockedTopic: null },
        earnedBadges: [],
      };
    }
    const hintsOpened = progress.problems[problem.id]?.maxHintOpened ?? 0;
    const result = submitAction(
      progress,
      { problem, verdict: payload.verdict, runtimeMs: payload.runtimeMs, today: clock.today, now: clock.now },
      topics,
    );
    // 마지막으로 제출한 코드는 다른 기기에서 이어 풀 수 있게 남긴다
    const current = result.progress.problems[problem.id];
    const next: UserProgress = current
      ? {
          ...result.progress,
          problems: { ...result.progress.problems, [problem.id]: { ...current, lastCode: payload.code } },
        }
      : result.progress;

    const failed = payload.results.find((r) => r.verdict !== "passed" && r.verdict !== "not-run");
    const submission = submissionToRow({
      id: "",
      problemKey: problem.id,
      source: problem.source,
      topic: problem.topic,
      level: problem.level,
      patternTags: problem.patternTags,
      language: payload.language,
      code: payload.code,
      verdict: payload.verdict,
      passed: payload.passed,
      total: payload.total,
      runtimeMs: payload.runtimeMs,
      hintsOpened,
      createdAt: clock.now,
      failedTestCaseId: failed?.testCaseId ?? null,
      // 숨은 케이스 내용은 이미 judge가 가렸다. 출력은 크기를 줄이려고 뺀다
      results: payload.results.map((r) => ({ ...r, stdout: "" })),
    });
    await repo.recordSubmission(userId, revision, submission, progressChanges(progress, next));
    return { progress: next, outcome: result.outcome, earnedBadges: result.earnedBadges };
  });
}

export async function openHintForUser(
  repo: ProgressRepository,
  userId: string,
  problem: Problem,
  step: HintStep,
  now: IsoDateTime,
): Promise<UserProgress> {
  return withRetry(async () => {
    const { progress, revision } = await repo.load(userId);
    const next = hintAction(progress, problem, step, now);
    const changes = progressChanges(progress, next);
    if (!isEmptyChanges(changes)) await repo.recordProblemState(userId, revision, changes);
    return next;
  });
}

export interface ConceptForUserResult {
  progress: UserProgress;
  outcome: ConceptOutcome;
  earnedBadges: BadgeId[];
}

async function conceptForUser(
  repo: ProgressRepository,
  userId: string,
  apply: (progress: UserProgress) => ConceptResult,
): Promise<ConceptForUserResult> {
  return withRetry(async () => {
    const { progress, revision } = await repo.load(userId);
    const result = apply(progress);
    const changes = progressChanges(progress, result.progress);
    if (!isEmptyChanges(changes)) await repo.recordConcept(userId, revision, changes);
    return result;
  });
}

export function readCardForUser(
  repo: ProgressRepository,
  userId: string,
  topic: Topic,
  cardId: string,
  topics: readonly Topic[],
  clock: { today: LocalDate; now: IsoDateTime },
) {
  return conceptForUser(repo, userId, (p) => cardAction(p, topic, cardId, topics, clock.today, clock.now));
}

export function recordQuizForUser(
  repo: ProgressRepository,
  userId: string,
  topic: Topic,
  score: number,
  topics: readonly Topic[],
  clock: { today: LocalDate; now: IsoDateTime },
) {
  return conceptForUser(repo, userId, (p) => quizAction(p, topic, score, topics, clock.today, clock.now));
}

/** 게스트 진도·제출 기록을 계정으로 옮긴다 */
export async function mergeGuestForUser(
  repo: ProgressRepository,
  userId: string,
  guest: UserProgress,
  guestSubmissions: SubmissionSummary[],
  topics: readonly Topic[],
  now: IsoDateTime,
): Promise<UserProgress> {
  return withRetry(async () => {
    const { progress, revision } = await repo.load(userId);
    const merged = awardBadges(mergeProgress(progress, { ...guest, userId }, topics), { type: "none" }, now).progress;
    const changes = progressChanges(progress, merged);
    // 코드를 지운 오래된 기록도 약점 분석에는 쓰이므로 빈 코드로 옮긴다
    const submissions = guestSubmissions
      .filter((s) => s.verdict !== "internal-error")
      .map((s) => submissionToRow({ ...s, code: s.code ?? "" }));
    await repo.mergeGuest(userId, revision, changes, submissions);
    return merged;
  });
}
