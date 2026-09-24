import type { NextRequest } from "next/server";
import { withStaleCheck } from "@/lib/ai/jobs";
import { getGeneratedStore } from "@/lib/ai/store";
import { toView } from "@/lib/ai/views";
import { getRequester } from "@/lib/server/requester";

/** 생성 진행 상태 / 검증된 문제. 본인이 만든 문제만 볼 수 있다 (정답 코드는 어떤 경우에도 포함되지 않음) */
export async function GET(_request: NextRequest, ctx: RouteContext<"/api/generate/[id]">) {
  const { id } = await ctx.params;
  const requester = await getRequester();
  const record = await getGeneratedStore().get(id);
  if (!record || record.ownerId !== requester.id) {
    return Response.json({ error: "문제를 찾을 수 없어요." }, { status: 404 });
  }
  return Response.json({ problem: toView(withStaleCheck(record)) });
}
