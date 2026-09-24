import type { BadgeId, HintStep, IsoDateTime, LocalDate, Problem, Topic, UserProgress } from "@/types";
import { awardBadges } from "./badges";
import { applyCardRead, applyQuizResult, type ConceptOutcome } from "./concept";
import { applyHintOpen, applySubmission, type SubmissionInput, type SubmissionOutcome } from "./submission";

/**
 * 진도를 바꾸는 사용자 행동. 규칙 적용 + 배지 판정을 한 번에 한다.
 * 게스트는 브라우저(progress-store)에서, 로그인 사용자는 서버(lib/progress/service.ts)에서 같은 함수를 쓴다.
 */

export interface SubmitResult {
  progress: UserProgress;
  outcome: SubmissionOutcome;
  earnedBadges: BadgeId[];
}

export function submitAction(progress: UserProgress, input: SubmissionInput, topics: readonly Topic[]): SubmitResult {
  const before = progress.problems[input.problem.id];
  const applied = applySubmission(progress, input, topics);
  if (applied.progress === progress) return { ...applied, earnedBadges: [] };
  const after = applied.progress.problems[input.problem.id];
  const event = applied.outcome.firstSolve
    ? {
        type: "first-solve" as const,
        problem: input.problem,
        attempts: after?.attempts ?? 1,
        hintsOpened: before?.maxHintOpened ?? 0,
      }
    : { type: "none" as const };
  const badges = awardBadges(applied.progress, event, input.now);
  return { progress: badges.progress, outcome: applied.outcome, earnedBadges: badges.earned };
}

export function hintAction(progress: UserProgress, problem: Problem, step: HintStep, now: IsoDateTime): UserProgress {
  return applyHintOpen(progress, problem, step, now);
}

export interface ConceptResult {
  progress: UserProgress;
  outcome: ConceptOutcome;
  earnedBadges: BadgeId[];
}

export function cardAction(
  progress: UserProgress,
  topic: Topic,
  cardId: string,
  topics: readonly Topic[],
  today: LocalDate,
  now: IsoDateTime,
): ConceptResult {
  const applied = applyCardRead(progress, topic, cardId, topics, today, now);
  if (applied.progress === progress) return { ...applied, earnedBadges: [] };
  const badges = awardBadges(applied.progress, { type: "none" }, now);
  return { progress: badges.progress, outcome: applied.outcome, earnedBadges: badges.earned };
}

export function quizAction(
  progress: UserProgress,
  topic: Topic,
  score: number,
  topics: readonly Topic[],
  today: LocalDate,
  now: IsoDateTime,
): ConceptResult {
  const applied = applyQuizResult(progress, topic, score, topics, today, now);
  const badges = awardBadges(applied.progress, { type: "none" }, now);
  return { progress: badges.progress, outcome: applied.outcome, earnedBadges: badges.earned };
}
