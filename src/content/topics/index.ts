import type { Topic, TopicSlug, UpcomingTopicSlug } from "@/types";
import { backtrackingTopic } from "./backtracking";
import { bfsTopic } from "./bfs";
import { binarySearchTopic } from "./binary-search";
import { dfsTopic } from "./dfs";
import { graphRepresentationTopic } from "./graph-representation";
import { hashTopic } from "./hash";
import { queueDequeTopic } from "./queue-deque";
import { recursionTopic } from "./recursion";
import { sortingTopic } from "./sorting";
import { stackTopic } from "./stack";

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
];

const TOPICS_BY_SLUG = new Map<string, Topic>(TOPICS.map((topic) => [topic.slug, topic]));

export function getTopic(slug: string): Topic | undefined {
  return TOPICS_BY_SLUG.get(slug);
}

export function isTopicSlug(value: string): value is TopicSlug {
  return TOPICS_BY_SLUG.has(value);
}

export const UPCOMING_TOPICS: { slug: UpcomingTopicSlug; title: string }[] = [{ slug: "dp", title: "DP" }];
