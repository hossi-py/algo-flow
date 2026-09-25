import type { ProgressMutationResponse } from "@/lib/progress/account";
import { hintBodySchema } from "@/lib/progress/api-schemas";
import { openHintForUser } from "@/lib/progress/service";
import { badRequest, findProblemForUser, readJson, requireAccount } from "@/lib/server/account";

/** 힌트 열기 (순서대로만) */
export async function POST(request: Request) {
  const account = await requireAccount();
  if (account instanceof Response) return account;
  const parsed = hintBodySchema.safeParse(await readJson(request));
  if (!parsed.success) return badRequest();

  const problem = await findProblemForUser(parsed.data.problemKey, account.user.id);
  if (!problem) return Response.json({ error: "문제를 찾을 수 없어요." }, { status: 404 });
  try {
    const progress = await openHintForUser(
      account.repo,
      account.user.id,
      problem,
      parsed.data.step,
      new Date().toISOString(),
    );
    return Response.json({ progress, earnedBadges: [] } satisfies ProgressMutationResponse);
  } catch (error) {
    // 순서를 건너뛴 요청은 규칙 함수가 거부한다
    return badRequest(error instanceof Error ? error.message : undefined);
  }
}
