import { TOPICS } from "@/content/topics";
import type { ProgressMutationResponse } from "@/lib/progress/account";
import { submitBodySchema } from "@/lib/progress/api-schemas";
import { submitForUser } from "@/lib/progress/service";
import { badRequest, findProblemForUser, readJson, requireAccount, serverClock } from "@/lib/server/account";
import type { JudgeResult } from "@/types";

/** 제출 결과 기록 (제출·문제 진도·XP·스트릭·레벨 클리어·배지를 한 트랜잭션으로) */
export async function POST(request: Request) {
  const account = await requireAccount();
  if (account instanceof Response) return account;
  const parsed = submitBodySchema.safeParse(await readJson(request));
  if (!parsed.success) return badRequest();
  const body = parsed.data;

  const problem = await findProblemForUser(body.problemKey, account.user.id);
  if (!problem) return Response.json({ error: "문제를 찾을 수 없어요." }, { status: 404 });

  const result = await submitForUser(
    account.repo,
    account.user.id,
    problem,
    {
      verdict: body.verdict,
      passed: Math.min(body.passed, body.total),
      total: body.total,
      runtimeMs: body.runtimeMs,
      language: body.language,
      code: body.code,
      results: body.results as unknown as JudgeResult["results"],
    },
    TOPICS,
    serverClock(),
  );
  const response: ProgressMutationResponse = { progress: result.progress, earnedBadges: result.earnedBadges };
  return Response.json({ ...response, outcome: result.outcome });
}
