import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Workspace } from "@/components/workspace/workspace";
import { isAiConfigured } from "@/lib/ai/client";
import { getGeneratedStore } from "@/lib/ai/store";
import { peekRequesterId } from "@/lib/server/requester";
import type { Problem } from "@/types";

/** 본인이 만든, 검증을 통과한 AI 문제만 연다 */
async function loadOwnProblem(id: string): Promise<Problem | null> {
  const owner = await peekRequesterId();
  if (!owner) return null;
  const record = await getGeneratedStore().get(id);
  if (!record || record.ownerId !== owner || record.status !== "verified") return null;
  return record.problem;
}

export async function generateMetadata(props: PageProps<"/ai-lab/problems/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const problem = await loadOwnProblem(id);
  return problem ? { title: problem.title, description: problem.summary } : {};
}

export default async function GeneratedProblemPage(props: PageProps<"/ai-lab/problems/[id]">) {
  const { id } = await props.params;
  const problem = await loadOwnProblem(id);
  if (!problem) notFound();
  return <Workspace problem={problem} aiEnabled={isAiConfigured()} />;
}
