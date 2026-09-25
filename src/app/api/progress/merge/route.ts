import { TOPICS } from "@/content/topics";
import type { ProgressMutationResponse } from "@/lib/progress/account";
import { mergeBodySchema } from "@/lib/progress/api-schemas";
import { mergeGuestForUser } from "@/lib/progress/service";
import { badRequest, readJson, requireAccount } from "@/lib/server/account";
import type { SubmissionSummary, UserProgress } from "@/types";

/** 로그인 직후: 이 브라우저의 게스트 진도·제출 기록을 계정으로 옮긴다 */
export async function POST(request: Request) {
  const account = await requireAccount();
  if (account instanceof Response) return account;
  const parsed = mergeBodySchema.safeParse(await readJson(request));
  if (!parsed.success) return badRequest("게스트 기록 형식이 올바르지 않아요.");

  const progress = await mergeGuestForUser(
    account.repo,
    account.user.id,
    parsed.data.progress as UserProgress,
    parsed.data.submissions as SubmissionSummary[],
    TOPICS,
    new Date().toISOString(),
  );
  return Response.json({ progress, earnedBadges: [] } satisfies ProgressMutationResponse);
}
