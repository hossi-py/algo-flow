import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { safeNextPath } from "@/lib/auth-redirect";
import { createServerSupabase } from "@/lib/supabase/server";

const OTP_TYPES: readonly EmailOtpType[] = ["magiclink", "email", "signup", "recovery", "invite", "email_change"];

/**
 * 로그인 링크·소셜 로그인에서 돌아오는 곳. 세션 쿠키를 만든 뒤 원래 보던 화면으로 보낸다.
 * - PKCE: ?code=
 * - 이메일 템플릿이 token_hash를 쓰는 경우: ?token_hash=&type=
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeNextPath(searchParams.get("next"));
  const fail = (reason: string) =>
    NextResponse.redirect(new URL(`/auth/login?error=${reason}&next=${encodeURIComponent(next)}`, origin));

  const supabase = await createServerSupabase();
  if (!supabase) return fail("config");

  const code = searchParams.get("code");
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    return error ? fail("callback") : NextResponse.redirect(new URL(next, origin));
  }

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  if (tokenHash && type && OTP_TYPES.includes(type)) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    return error ? fail("callback") : NextResponse.redirect(new URL(next, origin));
  }

  return fail(searchParams.get("error") ? "denied" : "callback");
}
