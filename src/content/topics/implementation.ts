import { IMPLEMENTATION_CARDS, IMPLEMENTATION_QUIZ } from "@/content/concepts/implementation";
import type { Topic } from "@/types";
import { defineConcept, defineLevels } from "./define";

export const implementationTopic: Topic = {
  slug: "implementation",
  order: 17,
  title: "구현 / 시뮬레이션",
  tagline: "규칙을 빠짐없이 그대로 따라 하면, 그게 곧 답이에요",
  color: "peach",
  icon: "cog",
  unlock: { type: "level-cleared", topic: "graph-advanced", level: 3 },
  concept: defineConcept("implementation", { cards: IMPLEMENTATION_CARDS, recognitionQuiz: IMPLEMENTATION_QUIZ }),
  levels: defineLevels("implementation", [
    {
      title: "한 칸씩 따라 하기",
      goal: "명령대로 위치와 방향, 시각을 바꿔요.",
      problemSlugs: ["sim-robot-final", "sim-turn-walk", "sim-clock-add"],
    },
    {
      title: "격자와 방향",
      goal: "벽이 있는 격자를 걷고, 판을 채우고 돌려요.",
      problemSlugs: ["sim-grid-robot", "sim-spiral-fill", "sim-rotate-matrix"],
    },
    {
      title: "상태가 바뀌는 판",
      goal: "규칙에 따라 판 전체나 주사위의 상태를 한 단계씩 바꿔요.",
      problemSlugs: ["sim-life-steps", "sim-gravity", "sim-dice-sum"],
    },
    {
      title: "문자열과 시간",
      goal: "기록을 쪼개 시각·날짜를 계산하고, 문자열을 규칙대로 줄여요.",
      problemSlugs: ["sim-rental-fee", "sim-zip-best", "sim-date-add"],
    },
    {
      title: "시뮬레이션 실전",
      goal: "여러 규칙이 얽힌 긴 시뮬레이션을 정확히 옮겨요.",
      problemSlugs: ["sim-snake", "sim-cleaning-robot", "sim-ladder"],
    },
  ]),
  signalIds: ["sig-follow-rules", "sig-direction-turn", "sig-time-format"],
};
