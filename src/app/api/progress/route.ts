import type { AccountSnapshotResponse } from "@/lib/progress/account";
import { loadProfile, requireAccount } from "@/lib/server/account";

/** 로그인 사용자의 진도 전체 + 프로필 */
export async function GET() {
  const account = await requireAccount();
  if (account instanceof Response) return account;
  const [{ progress }, profile] = await Promise.all([account.repo.load(account.user.id), loadProfile(account.user)]);
  return Response.json({ progress, profile } satisfies AccountSnapshotResponse);
}
