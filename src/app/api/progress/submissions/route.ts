import type { NextRequest } from "next/server";
import type { SubmissionsResponse } from "@/lib/progress/account";
import { requireAccount } from "@/lib/server/account";

/** 최근 제출 기록 (코드 포함) */
export async function GET(request: NextRequest) {
  const account = await requireAccount();
  if (account instanceof Response) return account;
  const limit = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 30));
  const submissions = await account.repo.listSubmissions(account.user.id, limit);
  return Response.json({ submissions } satisfies SubmissionsResponse);
}
