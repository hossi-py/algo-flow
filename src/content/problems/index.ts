import type { LevelNumber, PatternTag, Problem, TopicSlug } from "@/types";
import { backtrackingBracketStrings } from "./backtracking/bracket-strings";
import { backtrackingCoinFlips } from "./backtracking/coin-flips";
import { backtrackingGiftWeights } from "./backtracking/gift-weights";
import { backtrackingGuardRobots } from "./backtracking/guard-robots";
import { backtrackingMapColoring } from "./backtracking/map-coloring";
import { backtrackingNumberCards } from "./backtracking/number-cards";
import { backtrackingOutfitPicker } from "./backtracking/outfit-picker";
import { backtrackingSeatOrders } from "./backtracking/seat-orders";
import { backtrackingSnackTotal } from "./backtracking/snack-total";
import { backtrackingTeamPicks } from "./backtracking/team-picks";
import { bfsExactHops } from "./bfs/exact-hops";
import { bfsFriendDistance } from "./bfs/friend-distance";
import { bfsFrogLeaps } from "./bfs/frog-leaps";
import { bfsMazeShortest } from "./bfs/maze-shortest";
import { bfsNearestShelter } from "./bfs/nearest-shelter";
import { bfsNewsOrder } from "./bfs/news-order";
import { bfsPigeonPost } from "./bfs/pigeon-post";
import { bfsRumorDays } from "./bfs/rumor-days";
import { bfsSafeDial } from "./bfs/safe-dial";
import { bfsTwoBuckets } from "./bfs/two-buckets";
import { dfsCaveOrder } from "./dfs/cave-order";
import { dfsClubCount } from "./dfs/club-count";
import { dfsDownhillRoutes } from "./dfs/downhill-routes";
import { dfsFarthestVillages } from "./dfs/farthest-villages";
import { flowerZones } from "./dfs/flower-zones";
import { dfsMazeEscape } from "./dfs/maze-escape";
import { dfsPowerRestore } from "./dfs/power-restore";
import { dfsRadioNetwork } from "./dfs/radio-network";
import { dfsRecipeLoop } from "./dfs/recipe-loop";
import { dfsTeamSize } from "./dfs/team-size";
import { graphCommonFriends } from "./graph-representation/graph-common-friends";
import { graphDirectFlights } from "./graph-representation/graph-direct-flights";
import { graphFamilyTree } from "./graph-representation/graph-family-tree";
import { graphFriendList } from "./graph-representation/graph-friend-list";
import { graphGridPaths } from "./graph-representation/graph-grid-paths";
import { graphMatrixToList } from "./graph-representation/graph-matrix-to-list";
import { graphOneStrokeWalk } from "./graph-representation/graph-one-stroke-walk";
import { graphOneWayStreets } from "./graph-representation/graph-one-way-streets";
import { graphStationNeighbors } from "./graph-representation/graph-station-neighbors";
import { graphTrustedShop } from "./graph-representation/graph-trusted-shop";
import { dequeEndCards } from "./queue-deque/deque-end-cards";
import { dequeSteadySignal } from "./queue-deque/deque-steady-signal";
import { dequeSteppingScore } from "./queue-deque/deque-stepping-score";
import { dequeSushiRail } from "./queue-deque/deque-sushi-rail";
import { dequeTwoDoorTrain } from "./queue-deque/deque-two-door-train";
import { dequeWindowMax } from "./queue-deque/deque-window-max";
import { queueBakeryLine } from "./queue-deque/queue-bakery-line";
import { queueCardShuffle } from "./queue-deque/queue-card-shuffle";
import { queueCarouselLine } from "./queue-deque/queue-carousel-line";
import { queueDoughSplit } from "./queue-deque/queue-dough-split";
import { queueFrontBack } from "./queue-deque/queue-front-back";
import { queueHotPotato } from "./queue-deque/queue-hot-potato";
import { queueRecentVisits } from "./queue-deque/queue-recent-visits";
import { queueRoundKitchen } from "./queue-deque/queue-round-kitchen";
import { queueShuttleBus } from "./queue-deque/queue-shuttle-bus";
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
import { stackBracketPartner } from "./stack/bracket-partner";
import { stackDeadEndParking } from "./stack/dead-end-parking";
import { stackFolderPath } from "./stack/folder-path";
import { stackLightestBox } from "./stack/lightest-box";
import { stackPeekRecord } from "./stack/peek-record";
import { stackPlateTower } from "./stack/plate-tower";
import { stackRibbonTags } from "./stack/ribbon-tags";
import { stackSnowballMerge } from "./stack/snowball-merge";
import { stackTallerNeighbor } from "./stack/taller-neighbor";
import { stackTwinBalloons } from "./stack/twin-balloons";
import { stackUndoMemo } from "./stack/undo-memo";
import { stackVaultBrackets } from "./stack/vault-brackets";
import { stackWarmerWait } from "./stack/warmer-wait";
import { stackWidestBanner } from "./stack/widest-banner";

/** 큐레이션 문제 전체. 새 문제는 여기에 추가하고 토픽의 레벨 problemSlugs에도 등록한다 */
export const PROBLEMS: readonly Problem[] = [
  backtrackingBracketStrings,
  backtrackingCoinFlips,
  backtrackingGiftWeights,
  backtrackingGuardRobots,
  backtrackingMapColoring,
  backtrackingNumberCards,
  backtrackingOutfitPicker,
  backtrackingSeatOrders,
  backtrackingSnackTotal,
  backtrackingTeamPicks,
  bfsExactHops,
  bfsFriendDistance,
  bfsFrogLeaps,
  bfsMazeShortest,
  bfsNearestShelter,
  bfsNewsOrder,
  bfsPigeonPost,
  bfsRumorDays,
  bfsSafeDial,
  bfsTwoBuckets,
  dfsCaveOrder,
  dfsClubCount,
  dfsDownhillRoutes,
  dfsFarthestVillages,
  flowerZones,
  dfsMazeEscape,
  dfsPowerRestore,
  dfsRadioNetwork,
  dfsRecipeLoop,
  dfsTeamSize,
  graphCommonFriends,
  graphDirectFlights,
  graphFamilyTree,
  graphFriendList,
  graphGridPaths,
  graphMatrixToList,
  graphOneStrokeWalk,
  graphOneWayStreets,
  graphStationNeighbors,
  graphTrustedShop,
  dequeEndCards,
  dequeSteadySignal,
  dequeSteppingScore,
  dequeSushiRail,
  dequeTwoDoorTrain,
  dequeWindowMax,
  queueBakeryLine,
  queueCardShuffle,
  queueCarouselLine,
  queueDoughSplit,
  queueFrontBack,
  queueHotPotato,
  queueRecentVisits,
  queueRoundKitchen,
  queueShuttleBus,
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
  stackBracketPartner,
  stackDeadEndParking,
  stackFolderPath,
  stackLightestBox,
  stackPeekRecord,
  stackPlateTower,
  stackRibbonTags,
  stackSnowballMerge,
  stackTallerNeighbor,
  stackTwinBalloons,
  stackUndoMemo,
  stackVaultBrackets,
  stackWarmerWait,
  stackWidestBanner,
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
