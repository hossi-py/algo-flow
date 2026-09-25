/**
 * Supabase 설정. 값이 없으면 로그인·서버 저장 기능을 끄고 게스트 모드로만 동작한다.
 * NEXT_PUBLIC_ 값은 빌드 때 클라이언트 번들에 들어간다 (공개 키라 괜찮다).
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** 브라우저·서버 모두: 로그인 기능을 켤 수 있는지 */
export function isSupabaseConfigured(): boolean {
  return SUPABASE_URL !== "" && SUPABASE_PUBLIC_KEY !== "";
}

/** 로그인할 때 보여 줄 소셜 로그인 (Supabase 대시보드에서 켠 것만). 예: "google,github,kakao" */
export type OAuthProvider = "google" | "github" | "kakao";
export const OAUTH_PROVIDERS: OAuthProvider[] = (process.env.NEXT_PUBLIC_AUTH_PROVIDERS ?? "")
  .split(",")
  .map((item) => item.trim())
  .filter((item): item is OAuthProvider => item === "google" || item === "github" || item === "kakao");
