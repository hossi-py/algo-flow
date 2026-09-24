/** 로그인 뒤 돌아갈 주소: 이 사이트 안의 경로만 허용한다 (열린 리다이렉트 방지) */
export function safeNextPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "/";
  if (value.startsWith("/auth/")) return "/";
  return value;
}
