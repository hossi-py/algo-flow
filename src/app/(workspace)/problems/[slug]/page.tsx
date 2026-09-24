import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Workspace } from "@/components/workspace/workspace";
import { PROBLEMS, getProblem } from "@/content/problems";
import { isAiConfigured } from "@/lib/ai/client";

export function generateStaticParams() {
  return PROBLEMS.map((problem) => ({ slug: problem.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/problems/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const problem = getProblem(slug);
  return problem ? { title: problem.title, description: problem.summary } : {};
}

export default async function ProblemPage(props: PageProps<"/problems/[slug]">) {
  const { slug } = await props.params;
  const problem = getProblem(slug);
  if (!problem) notFound();
  return <Workspace problem={problem} aiEnabled={isAiConfigured()} />;
}
