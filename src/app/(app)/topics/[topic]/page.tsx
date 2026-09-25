import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicView } from "@/components/topic/topic-view";
import { TOPICS, getTopic, isTopicSlug } from "@/content/topics";

export function generateStaticParams() {
  return TOPICS.map((topic) => ({ topic: topic.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/topics/[topic]">): Promise<Metadata> {
  const { topic } = await props.params;
  const found = getTopic(topic);
  return found ? { title: found.title, description: found.tagline } : {};
}

export default async function TopicPage(props: PageProps<"/topics/[topic]">) {
  const { topic } = await props.params;
  if (!isTopicSlug(topic)) notFound();
  return <TopicView slug={topic} />;
}
