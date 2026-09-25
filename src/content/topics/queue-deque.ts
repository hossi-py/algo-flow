import { QUEUE_DEQUE_CARDS, QUEUE_DEQUE_QUIZ } from "@/content/concepts/queue-deque";
import type { Topic } from "@/types";
import { defineConcept, defineLevels } from "./define";

export const queueDequeTopic: Topic = {
  slug: "queue-deque",
  order: 2,
  title: "큐 / 덱",
  tagline: "줄 서기처럼, 먼저 온 사람이 먼저 나가요",
  color: "mint",
  icon: "line",
  unlock: { type: "level-cleared", topic: "stack", level: 3 },
  concept: defineConcept("queue-deque", { cards: QUEUE_DEQUE_CARDS, recognitionQuiz: QUEUE_DEQUE_QUIZ }),
  levels: defineLevels("queue-deque", [
    {
      title: "큐와 덱이 뭘까?",
      goal: "enqueue · dequeue와 덱의 양쪽 연산을 스택과 비교해 설명할 수 있어요.",
      problemSlugs: ["queue-bakery-line", "queue-front-back", "queue-carousel-line"],
    },
    {
      title: "느리지 않은 큐 만들기",
      goal: "Python은 collections.deque, JS는 앞 인덱스 포인터로 O(1) 큐를 구현해요.",
      problemSlugs: ["queue-card-shuffle", "queue-recent-visits", "queue-dough-split"],
    },
    {
      title: "차례대로 처리하기",
      goal: "도착 순서·순번 돌리기 같은 시뮬레이션 문제를 큐로 옮길 수 있어요.",
      problemSlugs: ["queue-round-kitchen", "queue-hot-potato", "queue-shuttle-bus"],
    },
    {
      title: "양쪽 끝 다루기",
      goal: "앞뒤에서 넣고 빼는 문제를 덱으로 풀어요.",
      problemSlugs: ["deque-two-door-train", "deque-end-cards", "deque-sushi-rail"],
    },
    {
      title: "슬라이딩 윈도우 최댓값",
      goal: "덱으로 구간 최댓값을 O(N)에 구하는 실전 문제를 풀어요.",
      problemSlugs: ["deque-window-max", "deque-steady-signal", "deque-stepping-score"],
    },
  ]),
  signalIds: ["sig-arrival-order", "sig-both-ends", "sig-recent-window"],
};
