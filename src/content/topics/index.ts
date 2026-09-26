import type { Topic, TopicSlug, UpcomingTopicSlug } from "@/types";
import { backtrackingTopic } from "./backtracking";
import { bfsTopic } from "./bfs";
import { binarySearchTopic } from "./binary-search";
import { dfsTopic } from "./dfs";
import { dijkstraTopic } from "./dijkstra";
import { dpTopic } from "./dp";
import { graphAdvancedTopic } from "./graph-advanced";
import { graphRepresentationTopic } from "./graph-representation";
import { greedyTopic } from "./greedy";
import { hashTopic } from "./hash";
import { heapTopic } from "./heap";
import { queueDequeTopic } from "./queue-deque";
import { recursionTopic } from "./recursion";
import { sortingTopic } from "./sorting";
import { stackTopic } from "./stack";
import { twoPointersTopic } from "./two-pointers";

/** 커리큘럼 순서 */
export const TOPICS: readonly Topic[] = [
  stackTopic,
  queueDequeTopic,
  recursionTopic,
  graphRepresentationTopic,
  dfsTopic,
  bfsTopic,
  backtrackingTopic,
  hashTopic,
  sortingTopic,
  binarySearchTopic,
  dpTopic,
  greedyTopic,
  twoPointersTopic,
  heapTopic,
  dijkstraTopic,
  graphAdvancedTopic,
];

const TOPICS_BY_SLUG = new Map<string, Topic>(TOPICS.map((topic) => [topic.slug, topic]));

export function getTopic(slug: string): Topic | undefined {
  return TOPICS_BY_SLUG.get(slug);
}

export function isTopicSlug(value: string): value is TopicSlug {
  return TOPICS_BY_SLUG.has(value);
}

/** 지금은 모든 토픽이 열려 있어요. 새 토픽을 준비할 때 여기에 적으면 로드맵에 "준비 중"으로 보여요 */
export const UPCOMING_TOPICS: { slug: UpcomingTopicSlug; title: string }[] = [];
