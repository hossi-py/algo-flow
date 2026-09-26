import type { Topic, TopicSlug, UpcomingTopicSlug } from "@/types";
import { backtrackingTopic } from "./backtracking";
import { bfsTopic } from "./bfs";
import { dfsTopic } from "./dfs";
import { graphRepresentationTopic } from "./graph-representation";
import { hashTopic } from "./hash";
import { queueDequeTopic } from "./queue-deque";
import { recursionTopic } from "./recursion";
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
];

const TOPICS_BY_SLUG = new Map<string, Topic>(TOPICS.map((topic) => [topic.slug, topic]));

export function getTopic(slug: string): Topic | undefined {
  return TOPICS_BY_SLUG.get(slug);
}

export function isTopicSlug(value: string): value is TopicSlug {
  return TOPICS_BY_SLUG.has(value);
}

export const UPCOMING_TOPICS: { slug: UpcomingTopicSlug; title: string }[] = [
  { slug: "sorting", title: "정렬" },
  { slug: "binary-search", title: "이분 탐색" },
  { slug: "dp", title: "DP" },
];
