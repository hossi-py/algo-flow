import "server-only";
import { cookies, headers } from "next/headers";

/**
 * 요청한 사람. 로그인 전에는 httpOnly 쿠키로 게스트를 구분한다 (AI 사용 한도·생성 문제 소유자 판별용).
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

/** Route Handler에서만 호출한다 (게스트 쿠키를 새로 심을 수 있어야 하므로) */
export async function getRequester(): Promise<Requester> {
  const ip = await clientIp();
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

/** Server Component용: 쿠키를 읽기만 한다 (없으면 null) */
export async function peekRequesterId(): Promise<string | null> {
  const guestId = (await cookies()).get(GUEST_COOKIE)?.value;
  return guestId && GUEST_ID_PATTERN.test(guestId) ? `guest:${guestId}` : null;
}
