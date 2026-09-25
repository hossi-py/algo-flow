import { getTopic, TOPICS } from "@/content/topics";
import type { ProgressMutationResponse } from "@/lib/progress/account";
import { conceptBodySchema } from "@/lib/progress/api-schemas";
import { readCardForUser, recordQuizForUser } from "@/lib/progress/service";
import { badRequest, readJson, requireAccount, serverClock } from "@/lib/server/account";

/** 개념 카드 읽음 · 유형 인식 퀴즈 결과 */
export async function POST(request: Request) {
  const account = await requireAccount();
  if (account instanceof Response) return account;
  const parsed = conceptBodySchema.safeParse(await readJson(request));
  if (!parsed.success) return badRequest();
  const body = parsed.data;
  const topic = getTopic(body.topic);
  if (!topic) return badRequest();

  const clock = serverClock();
  const result =
    body.kind === "card"
      ? await readCardForUser(account.repo, account.user.id, topic, body.cardId, TOPICS, clock)
      : await recordQuizForUser(account.repo, account.user.id, topic, body.score, TOPICS, clock);
  const response: ProgressMutationResponse = { progress: result.progress, earnedBadges: result.earnedBadges };
  return Response.json({ ...response, outcome: result.outcome });
}
