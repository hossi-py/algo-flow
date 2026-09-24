import "server-only";
import { cookies, headers } from "next/headers";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/supabase/server";

/**
 * 요청한 사람. 로그인했으면 Supabase 사용자, 아니면 httpOnly 쿠키로 구분한 게스트
 * (AI 사용 한도·생성 문제 소유자 판별용).
 */
export interface Requester {
  id: string;
  kind: "guest" | "user";
  ip: string;
}

export const GUEST_COOKIE = "af_guest";
const GUEST_ID_PATTERN = /^[0-9a-f-]{36}$/;

async function clientIp(): Promise<string> {
  const list = await headers();
  return list.get("x-forwarded-for")?.split(",")[0]?.trim() || list.get("x-real-ip") || "unknown";
}

/** Supabase가 설정돼 있으면 AI 문제 생성은 로그인 사용자만 (docs/03 §8) */
export function aiLabRequiresLogin(): boolean {
  return isSupabaseAdminConfigured();
}

/** Route Handler에서만 호출한다 (게스트 쿠키를 새로 심을 수 있어야 하므로) */
export async function getRequester(): Promise<Requester> {
  const ip = await clientIp();
  const user = await getAuthUser();
  if (user) return { id: user.id, kind: "user", ip };

  const jar = await cookies();
  let guestId = jar.get(GUEST_COOKIE)?.value;
  if (!guestId || !GUEST_ID_PATTERN.test(guestId)) {
    guestId = crypto.randomUUID();
    jar.set(GUEST_COOKIE, guestId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return { id: `guest:${guestId}`, kind: "guest", ip };
}

/** Server Component용: 쿠키를 읽기만 한다 (게스트 쿠키도 없으면 null) */
export async function peekRequesterId(): Promise<string | null> {
  const user = await getAuthUser();
  if (user) return user.id;
  const guestId = (await cookies()).get(GUEST_COOKIE)?.value;
  return guestId && GUEST_ID_PATTERN.test(guestId) ? `guest:${guestId}` : null;
}
