import type { LevelNumber, PatternTag, Problem, TopicSlug } from "@/types";
import { backtrackingBracketStrings } from "./backtracking/bracket-strings";
import { backtrackingCoinFlips } from "./backtracking/coin-flips";
import { backtrackingFlowerSudoku } from "./backtracking/flower-sudoku";
import { backtrackingGiftWeights } from "./backtracking/gift-weights";
import { backtrackingGuardRobots } from "./backtracking/guard-robots";
import { backtrackingLetterBoard } from "./backtracking/letter-board";
import { backtrackingMapColoring } from "./backtracking/map-coloring";
import { backtrackingNumberCards } from "./backtracking/number-cards";
import { backtrackingOutfitPicker } from "./backtracking/outfit-picker";
import { backtrackingPodiumOrders } from "./backtracking/podium-orders";
import { backtrackingSeatOrders } from "./backtracking/seat-orders";
import { backtrackingSnackTotal } from "./backtracking/snack-total";
import { backtrackingStairSteps } from "./backtracking/stair-steps";
import { backtrackingStickerScore } from "./backtracking/sticker-score";
import { backtrackingTeamPicks } from "./backtracking/team-picks";
import { bfsExactHops } from "./bfs/exact-hops";
import { bfsFireStations } from "./bfs/fire-stations";
import { bfsFriendDistance } from "./bfs/friend-distance";
import { bfsFrogLeaps } from "./bfs/frog-leaps";
import { bfsKangarooField } from "./bfs/kangaroo-field";
import { bfsKeyEscape } from "./bfs/key-escape";
import { bfsMazeShortest } from "./bfs/maze-shortest";
import { bfsNearestShelter } from "./bfs/nearest-shelter";
import { bfsNearestStore } from "./bfs/nearest-store";
import { bfsNewsOrder } from "./bfs/news-order";
import { bfsPigeonPost } from "./bfs/pigeon-post";
import { bfsRippleRings } from "./bfs/ripple-rings";
import { bfsRumorDays } from "./bfs/rumor-days";
import { bfsSafeDial } from "./bfs/safe-dial";
import { bfsTwoBuckets } from "./bfs/two-buckets";
import { binarySearchCutCables } from "./binary-search/cut-cables";
import { binarySearchCutoffCount } from "./binary-search/cutoff-count";
import { binarySearchEatingSpeed } from "./binary-search/eating-speed";
import { binarySearchKthTable } from "./binary-search/kth-table";
import { binarySearchLanternSpacing } from "./binary-search/lantern-spacing";
import { binarySearchNearestStation } from "./binary-search/nearest-station";
import { binarySearchPageFinder } from "./binary-search/page-finder";
import { binarySearchRangeCount } from "./binary-search/range-count";
import { binarySearchRisingPath } from "./binary-search/rising-path";
import { binarySearchRotatedShelf } from "./binary-search/rotated-shelf";
import { binarySearchSplitBooks } from "./binary-search/split-books";
import { binarySearchSquareGarden } from "./binary-search/square-garden";
import { binarySearchToyWorkshop } from "./binary-search/toy-workshop";
import { binarySearchTreeSaw } from "./binary-search/tree-saw";
import { binarySearchUpdown } from "./binary-search/updown";
import { dfsCaveOrder } from "./dfs/cave-order";
import { dfsClubCount } from "./dfs/club-count";
import { dfsDownhillRoutes } from "./dfs/downhill-routes";
import { dfsFarthestVillages } from "./dfs/farthest-villages";
import { dfsFinishOrder } from "./dfs/finish-order";
import { flowerZones } from "./dfs/flower-zones";
import { dfsForestLakes } from "./dfs/forest-lakes";
import { dfsLoopTrail } from "./dfs/loop-trail";
import { dfsMazeEscape } from "./dfs/maze-escape";
import { dfsOneWayTour } from "./dfs/one-way-tour";
import { dfsOrchardSplit } from "./dfs/orchard-split";
import { dfsPowerRestore } from "./dfs/power-restore";
import { dfsRadioNetwork } from "./dfs/radio-network";
import { dfsRecipeLoop } from "./dfs/recipe-loop";
import { dfsTeamSize } from "./dfs/team-size";
import { dijkstraCheapestRoute } from "./dijkstra/cheapest-route";
import { dijkstraCountRoutes } from "./dijkstra/count-routes";
import { dijkstraCouponFare } from "./dijkstra/coupon-fare";
import { dijkstraDeliveryTime } from "./dijkstra/delivery-time";
import { dijkstraGentleHike } from "./dijkstra/gentle-hike";
import { dijkstraGridCost } from "./dijkstra/grid-cost";
import { dijkstraLimitedTransfers } from "./dijkstra/limited-transfers";
import { dijkstraMustVisit } from "./dijkstra/must-visit";
import { dijkstraNearestShelter } from "./dijkstra/nearest-shelter";
import { dijkstraPartyRoundtrip } from "./dijkstra/party-roundtrip";
import { dijkstraReachableInTime } from "./dijkstra/reachable-in-time";
import { dijkstraRoutePath } from "./dijkstra/route-path";
import { dijkstraSignalDelay } from "./dijkstra/signal-delay";
import { dijkstraUsefulRoads } from "./dijkstra/useful-roads";
import { dijkstraWallBreak } from "./dijkstra/wall-break";
import { dpAcornHouses } from "./dp/acorn-houses";
import { dpBerryMarket } from "./dp/berry-market";
import { dpBestStreak } from "./dp/best-streak";
import { dpCoinWays } from "./dp/coin-ways";
import { dpCommonSong } from "./dp/common-song";
import { dpFewestCoins } from "./dp/fewest-coins";
import { dpForestPaths } from "./dp/forest-paths";
import { dpFruitPyramid } from "./dp/fruit-pyramid";
import { dpMinTrail } from "./dp/min-trail";
import { dpPalindromeCuts } from "./dp/palindrome-cuts";
import { dpPicnicBag } from "./dp/picnic-bag";
import { dpSecretMessage } from "./dp/secret-message";
import { dpStairWays } from "./dp/stair-ways";
import { dpSteppingStones } from "./dp/stepping-stones";
import { dpWordEdit } from "./dp/word-edit";
import { graphCommonFriends } from "./graph-representation/graph-common-friends";
import { graphDirectFlights } from "./graph-representation/graph-direct-flights";
import { graphFamilyTree } from "./graph-representation/graph-family-tree";
import { graphFollowers } from "./graph-representation/graph-followers";
import { graphFriendList } from "./graph-representation/graph-friend-list";
import { graphGridPaths } from "./graph-representation/graph-grid-paths";
import { graphIslandBridges } from "./graph-representation/graph-island-bridges";
import { graphMatrixToList } from "./graph-representation/graph-matrix-to-list";
import { graphOneStrokeWalk } from "./graph-representation/graph-one-stroke-walk";
import { graphOneWayStreets } from "./graph-representation/graph-one-way-streets";
import { graphOrgLevels } from "./graph-representation/graph-org-levels";
import { graphStationNeighbors } from "./graph-representation/graph-station-neighbors";
import { graphTripleFriends } from "./graph-representation/graph-triple-friends";
import { graphTrustedShop } from "./graph-representation/graph-trusted-shop";
import { graphTwoTransfers } from "./graph-representation/graph-two-transfers";
import { greedyBalloonArrows } from "./greedy/balloon-arrows";
import { greedyBestTrade } from "./greedy/best-trade";
import { greedyBiggestAfterErase } from "./greedy/biggest-after-erase";
import { greedyCandyLine } from "./greedy/candy-line";
import { greedyChangeCoins } from "./greedy/change-coins";
import { greedyCookieShare } from "./greedy/cookie-share";
import { greedyFewestJumps } from "./greedy/fewest-jumps";
import { greedyFuelLoop } from "./greedy/fuel-loop";
import { greedyHeightQueue } from "./greedy/height-queue";
import { greedyLetterParts } from "./greedy/letter-parts";
import { greedyMeetingRoom } from "./greedy/meeting-room";
import { greedyRopeLift } from "./greedy/rope-lift";
import { greedyShortestFirst } from "./greedy/shortest-first";
import { greedySnackBudget } from "./greedy/snack-budget";
import { greedyStoneJump } from "./greedy/stone-jump";
import { hashAnagramGroups } from "./hash/anagram-groups";
import { hashBalancedDays } from "./hash/balanced-days";
import { hashCampingGear } from "./hash/camping-gear";
import { hashClassVote } from "./hash/class-vote";
import { hashDiffPairs } from "./hash/diff-pairs";
import { hashFirstRepeat } from "./hash/first-repeat";
import { hashGuestList } from "./hash/guest-list";
import { hashLongestRun } from "./hash/longest-run";
import { hashLostCamper } from "./hash/lost-camper";
import { hashMagazineLetter } from "./hash/magazine-letter";
import { hashSecretPattern } from "./hash/secret-pattern";
import { hashSnackLine } from "./hash/snack-line";
import { hashSnackPair } from "./hash/snack-pair";
import { hashStickerAlbum } from "./hash/sticker-album";
import { hashSubarraySum } from "./hash/subarray-sum";
import { heapBestProjects } from "./heap/best-projects";
import { heapClosestTrees } from "./heap/closest-trees";
import { heapCoursePlan } from "./heap/course-plan";
import { heapFewestRefuels } from "./heap/fewest-refuels";
import { heapKthLargest } from "./heap/kth-largest";
import { heapLastStone } from "./heap/last-stone";
import { heapMatrixKth } from "./heap/matrix-kth";
import { heapMergePiles } from "./heap/merge-piles";
import { heapMergeShelves } from "./heap/merge-shelves";
import { heapNearlySorted } from "./heap/nearly-sorted";
import { heapNoRepeatString } from "./heap/no-repeat-string";
import { heapRunningMedian } from "./heap/running-median";
import { heapSmallestK } from "./heap/smallest-k";
import { heapTaskOrder } from "./heap/task-order";
import { heapTopWords } from "./heap/top-words";
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
import { recursionBulbSignal } from "./recursion/bulb-signal";
import { recursionCellDivision } from "./recursion/cell-division";
import { recursionCookieBoxes } from "./recursion/cookie-boxes";
import { recursionDigitSum } from "./recursion/digit-sum";
import { recursionEchoValley } from "./recursion/echo-valley";
import { recursionHailstoneTrip } from "./recursion/hailstone-trip";
import { recursionHallwayTiles } from "./recursion/hallway-tiles";
import { recursionHanoiKthMove } from "./recursion/hanoi-kth-move";
import { recursionMagicScroll } from "./recursion/magic-scroll";
import { recursionQuadGarden } from "./recursion/quad-garden";
import { recursionRabbitFamily } from "./recursion/rabbit-family";
import { recursionRocketCountdown } from "./recursion/rocket-countdown";
import { recursionSnowflakeKnit } from "./recursion/snowflake-knit";
import { recursionSteppingStones } from "./recursion/stepping-stones";
import { recursionSwappedPairs } from "./recursion/swapped-pairs";
import { sortingAdjacentSwaps } from "./sorting/adjacent-swaps";
import { sortingBiggestNumber } from "./sorting/biggest-number";
import { sortingClosestGap } from "./sorting/closest-gap";
import { sortingHeightOrder } from "./sorting/height-order";
import { sortingInversions } from "./sorting/inversions";
import { sortingKthHeaviest } from "./sorting/kth-heaviest";
import { sortingLeaderboard } from "./sorting/leaderboard";
import { sortingMeetingRooms } from "./sorting/meeting-rooms";
import { sortingMergeBookings } from "./sorting/merge-bookings";
import { sortingMergeShelves } from "./sorting/merge-shelves";
import { sortingPhotoNames } from "./sorting/photo-names";
import { sortingRaftPairs } from "./sorting/raft-pairs";
import { sortingRankCompress } from "./sorting/rank-compress";
import { sortingScoreRanks } from "./sorting/score-ranks";
import { sortingWordDictionary } from "./sorting/word-dictionary";
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
import { twoPointersAnagramSpots } from "./two-pointers/anagram-spots";
import { twoPointersBestKDays } from "./two-pointers/best-k-days";
import { twoPointersCoverWindow } from "./two-pointers/cover-window";
import { twoPointersFruitBasket } from "./two-pointers/fruit-basket";
import { twoPointersGoodWeeks } from "./two-pointers/good-weeks";
import { twoPointersHiddenWord } from "./two-pointers/hidden-word";
import { twoPointersPalindromeNote } from "./two-pointers/palindrome-note";
import { twoPointersRainGarden } from "./two-pointers/rain-garden";
import { twoPointersShortestEnough } from "./two-pointers/shortest-enough";
import { twoPointersSortedPair } from "./two-pointers/sorted-pair";
import { twoPointersSortedSquares } from "./two-pointers/sorted-squares";
import { twoPointersThreeClosest } from "./two-pointers/three-closest";
import { twoPointersUniqueStamps } from "./two-pointers/unique-stamps";
import { twoPointersWaterBox } from "./two-pointers/water-box";
import { twoPointersZerosBack } from "./two-pointers/zeros-back";

/** 큐레이션 문제 전체. 새 문제는 여기에 추가하고 토픽의 레벨 problemSlugs에도 등록한다 */
export const PROBLEMS: readonly Problem[] = [
  backtrackingBracketStrings,
  backtrackingCoinFlips,
  backtrackingFlowerSudoku,
  backtrackingGiftWeights,
  backtrackingGuardRobots,
  backtrackingLetterBoard,
  backtrackingMapColoring,
  backtrackingNumberCards,
  backtrackingOutfitPicker,
  backtrackingPodiumOrders,
  backtrackingSeatOrders,
  backtrackingSnackTotal,
  backtrackingStairSteps,
  backtrackingStickerScore,
  backtrackingTeamPicks,
  bfsExactHops,
  bfsFireStations,
  bfsFriendDistance,
  bfsFrogLeaps,
  bfsKangarooField,
  bfsKeyEscape,
  bfsMazeShortest,
  bfsNearestShelter,
  bfsNearestStore,
  bfsNewsOrder,
  bfsPigeonPost,
  bfsRippleRings,
  bfsRumorDays,
  bfsSafeDial,
  bfsTwoBuckets,
  binarySearchCutCables,
  binarySearchCutoffCount,
  binarySearchEatingSpeed,
  binarySearchKthTable,
  binarySearchLanternSpacing,
  binarySearchNearestStation,
  binarySearchPageFinder,
  binarySearchRangeCount,
  binarySearchRisingPath,
  binarySearchRotatedShelf,
  binarySearchSplitBooks,
  binarySearchSquareGarden,
  binarySearchToyWorkshop,
  binarySearchTreeSaw,
  binarySearchUpdown,
  dfsCaveOrder,
  dfsClubCount,
  dfsDownhillRoutes,
  dfsFarthestVillages,
  dfsFinishOrder,
  flowerZones,
  dfsForestLakes,
  dfsLoopTrail,
  dfsMazeEscape,
  dfsOneWayTour,
  dfsOrchardSplit,
  dfsPowerRestore,
  dfsRadioNetwork,
  dfsRecipeLoop,
  dfsTeamSize,
  dijkstraCheapestRoute,
  dijkstraCountRoutes,
  dijkstraCouponFare,
  dijkstraDeliveryTime,
  dijkstraGentleHike,
  dijkstraGridCost,
  dijkstraLimitedTransfers,
  dijkstraMustVisit,
  dijkstraNearestShelter,
  dijkstraPartyRoundtrip,
  dijkstraReachableInTime,
  dijkstraRoutePath,
  dijkstraSignalDelay,
  dijkstraUsefulRoads,
  dijkstraWallBreak,
  dpAcornHouses,
  dpBerryMarket,
  dpBestStreak,
  dpCoinWays,
  dpCommonSong,
  dpFewestCoins,
  dpForestPaths,
  dpFruitPyramid,
  dpMinTrail,
  dpPalindromeCuts,
  dpPicnicBag,
  dpSecretMessage,
  dpStairWays,
  dpSteppingStones,
  dpWordEdit,
  graphCommonFriends,
  graphDirectFlights,
  graphFamilyTree,
  graphFollowers,
  graphFriendList,
  graphGridPaths,
  graphIslandBridges,
  graphMatrixToList,
  graphOneStrokeWalk,
  graphOneWayStreets,
  graphOrgLevels,
  graphStationNeighbors,
  graphTripleFriends,
  graphTrustedShop,
  graphTwoTransfers,
  greedyBalloonArrows,
  greedyBestTrade,
  greedyBiggestAfterErase,
  greedyCandyLine,
  greedyChangeCoins,
  greedyCookieShare,
  greedyFewestJumps,
  greedyFuelLoop,
  greedyHeightQueue,
  greedyLetterParts,
  greedyMeetingRoom,
  greedyRopeLift,
  greedyShortestFirst,
  greedySnackBudget,
  greedyStoneJump,
  hashAnagramGroups,
  hashBalancedDays,
  hashCampingGear,
  hashClassVote,
  hashDiffPairs,
  hashFirstRepeat,
  hashGuestList,
  hashLongestRun,
  hashLostCamper,
  hashMagazineLetter,
  hashSecretPattern,
  hashSnackLine,
  hashSnackPair,
  hashStickerAlbum,
  hashSubarraySum,
  heapBestProjects,
  heapClosestTrees,
  heapCoursePlan,
  heapFewestRefuels,
  heapKthLargest,
  heapLastStone,
  heapMatrixKth,
  heapMergePiles,
  heapMergeShelves,
  heapNearlySorted,
  heapNoRepeatString,
  heapRunningMedian,
  heapSmallestK,
  heapTaskOrder,
  heapTopWords,
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
  recursionBulbSignal,
  recursionCellDivision,
  recursionCookieBoxes,
  recursionDigitSum,
  recursionEchoValley,
  recursionHailstoneTrip,
  recursionHallwayTiles,
  recursionHanoiKthMove,
  recursionMagicScroll,
  recursionQuadGarden,
  recursionRabbitFamily,
  recursionRocketCountdown,
  recursionSnowflakeKnit,
  recursionSteppingStones,
  recursionSwappedPairs,
  sortingAdjacentSwaps,
  sortingBiggestNumber,
  sortingClosestGap,
  sortingHeightOrder,
  sortingInversions,
  sortingKthHeaviest,
  sortingLeaderboard,
  sortingMeetingRooms,
  sortingMergeBookings,
  sortingMergeShelves,
  sortingPhotoNames,
  sortingRaftPairs,
  sortingRankCompress,
  sortingScoreRanks,
  sortingWordDictionary,
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
  twoPointersAnagramSpots,
  twoPointersBestKDays,
  twoPointersCoverWindow,
  twoPointersFruitBasket,
  twoPointersGoodWeeks,
  twoPointersHiddenWord,
  twoPointersPalindromeNote,
  twoPointersRainGarden,
  twoPointersShortestEnough,
  twoPointersSortedPair,
  twoPointersSortedSquares,
  twoPointersThreeClosest,
  twoPointersUniqueStamps,
  twoPointersWaterBox,
  twoPointersZerosBack,
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
