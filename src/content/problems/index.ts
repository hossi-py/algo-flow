import type { LevelNumber, PatternTag, Problem, TopicSlug } from "@/types";
import { flowerZones } from "./dfs/flower-zones";
import { dequeEndCards } from "./queue-deque/deque-end-cards";
import { dequeSteadySignal } from "./queue-deque/deque-steady-signal";
import { dequeTwoDoorTrain } from "./queue-deque/deque-two-door-train";
import { dequeWindowMax } from "./queue-deque/deque-window-max";
import { queueBakeryLine } from "./queue-deque/queue-bakery-line";
import { queueCardShuffle } from "./queue-deque/queue-card-shuffle";
import { queueFrontBack } from "./queue-deque/queue-front-back";
import { queueHotPotato } from "./queue-deque/queue-hot-potato";
import { queueRecentVisits } from "./queue-deque/queue-recent-visits";
import { queueRoundKitchen } from "./queue-deque/queue-round-kitchen";
import { recursionCookieBoxes } from "./recursion/cookie-boxes";
import { recursionDigitSum } from "./recursion/digit-sum";
import { recursionHailstoneTrip } from "./recursion/hailstone-trip";
import { recursionHanoiKthMove } from "./recursion/hanoi-kth-move";
import { recursionQuadGarden } from "./recursion/quad-garden";
import { recursionRabbitFamily } from "./recursion/rabbit-family";
import { recursionRocketCountdown } from "./recursion/rocket-countdown";
import { recursionSnowflakeKnit } from "./recursion/snowflake-knit";
import { recursionSteppingStones } from "./recursion/stepping-stones";
import { recursionSwappedPairs } from "./recursion/swapped-pairs";
import { stackBackspaceKeyboard } from "./stack/backspace-keyboard";
import { stackPeekRecord } from "./stack/peek-record";
import { stackPlateTower } from "./stack/plate-tower";
import { stackRibbonTags } from "./stack/ribbon-tags";
import { stackSnowballMerge } from "./stack/snowball-merge";
import { stackTallerNeighbor } from "./stack/taller-neighbor";
import { stackTwinBalloons } from "./stack/twin-balloons";
import { stackUndoMemo } from "./stack/undo-memo";
import { stackVaultBrackets } from "./stack/vault-brackets";
import { stackWarmerWait } from "./stack/warmer-wait";

/** 큐레이션 문제 전체. 새 문제는 여기에 추가하고 토픽의 레벨 problemSlugs에도 등록한다 */
export const PROBLEMS: readonly Problem[] = [
  flowerZones,
  dequeEndCards,
  dequeSteadySignal,
  dequeTwoDoorTrain,
  dequeWindowMax,
  queueBakeryLine,
  queueCardShuffle,
  queueFrontBack,
  queueHotPotato,
  queueRecentVisits,
  queueRoundKitchen,
  recursionCookieBoxes,
  recursionDigitSum,
  recursionHailstoneTrip,
  recursionHanoiKthMove,
  recursionQuadGarden,
  recursionRabbitFamily,
  recursionRocketCountdown,
  recursionSnowflakeKnit,
  recursionSteppingStones,
  recursionSwappedPairs,
  stackBackspaceKeyboard,
  stackPeekRecord,
  stackPlateTower,
  stackRibbonTags,
  stackSnowballMerge,
  stackTallerNeighbor,
  stackTwinBalloons,
  stackUndoMemo,
  stackVaultBrackets,
  stackWarmerWait,
];

/** 목록 화면에서 쓰는 가벼운 요약 (테스트케이스·힌트 제외) */
export interface ProblemMeta {
  slug: string;
  title: string;
  summary: string;
  topic: TopicSlug;
  level: LevelNumber;
  estimatedMinutes: number;
  xp: number;
  patternTags: PatternTag[];
}

export function toProblemMeta(problem: Problem): ProblemMeta {
  return {
    slug: problem.slug,
    title: problem.title,
    summary: problem.summary,
    topic: problem.topic,
    level: problem.level,
    estimatedMinutes: problem.estimatedMinutes,
    xp: problem.xp,
    patternTags: problem.patternTags,
  };
}

const PROBLEMS_BY_SLUG = new Map(PROBLEMS.map((problem) => [problem.slug, problem]));

export function getProblem(slug: string): Problem | undefined {
  return PROBLEMS_BY_SLUG.get(slug);
}

export function getProblemMeta(slug: string): ProblemMeta | undefined {
  const problem = PROBLEMS_BY_SLUG.get(slug);
  return problem ? toProblemMeta(problem) : undefined;
}
