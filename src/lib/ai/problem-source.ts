import "server-only";
import { getProblem } from "@/content/problems";
import type { Problem } from "@/types";
import { getGeneratedStore } from "./store";

/**
 * 문제 키로 문제를 찾는다. 코치 프롬프트에 넣는 문제 내용은 클라이언트가 보낸 값이 아니라 서버 원본을 쓴다.
 * AI 생성 문제는 만든 사람만 볼 수 있다.
 */
export async function loadProblem(problemKey: string, requesterId: string): Promise<Problem | null> {
  if (problemKey.startsWith("c:")) return getProblem(problemKey.slice(2)) ?? null;
  if (problemKey.startsWith("g:")) {
    const record = await getGeneratedStore().get(problemKey.slice(2));
    if (!record || record.ownerId !== requesterId || record.status !== "verified") return null;
    return record.problem;
  }
  return null;
}
