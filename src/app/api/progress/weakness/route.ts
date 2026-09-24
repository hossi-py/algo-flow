import type { WeaknessResponse } from "@/lib/progress/account";
import { requireAccount } from "@/lib/server/account";

/** 패턴별 제출 통계 (user_pattern_stats 뷰). 점수는 게스트와 같은 lib/progress/weakness.ts로 계산한다 */
export async function GET() {
  const account = await requireAccount();
  if (account instanceof Response) return account;
  const stats = await account.repo.patternStats(account.user.id);
  return Response.json({ stats } satisfies WeaknessResponse);
}
