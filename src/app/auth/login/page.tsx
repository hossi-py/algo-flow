import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { Brand } from "@/components/layout/brand";
import { safeNextPath } from "@/lib/auth-redirect";

export const metadata: Metadata = { title: "로그인" };

export default async function LoginPage(props: PageProps<"/auth/login">) {
  const params = await props.searchParams;
  const next = safeNextPath(typeof params.next === "string" ? params.next : null);
  const error = typeof params.error === "string" ? params.error : null;
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-background px-4 py-10">
      <Brand />
      <LoginForm next={next} error={error} />
    </div>
  );
}
