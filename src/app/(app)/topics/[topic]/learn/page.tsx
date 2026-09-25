import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LearnView } from "@/components/learn/learn-view";
import { TOPICS, getTopic, isTopicSlug } from "@/content/topics";

export function generateStaticParams() {
  return TOPICS.map((topic) => ({ topic: topic.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/topics/[topic]/learn">): Promise<Metadata> {
  const { topic } = await props.params;
  const found = getTopic(topic);
  return found ? { title: `${found.title} 개념 학습`, description: found.tagline } : {};
}

export default async function LearnPage(props: PageProps<"/topics/[topic]/learn">) {
  const { topic } = await props.params;
  if (!isTopicSlug(topic)) notFound();
  return <LearnView slug={topic} />;
}
