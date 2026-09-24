"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MailCheck } from "lucide-react";
import { PopButton } from "@/components/common/pop-button";
import { Nodi } from "@/components/mascot/nodi";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { OAUTH_PROVIDERS, type OAuthProvider } from "@/lib/supabase/env";
import { useAccountStore } from "@/stores/account-store";

const PROVIDER_LABELS: Record<OAuthProvider, string> = {
  google: "Google로 계속하기",
  github: "GitHub로 계속하기",
  kakao: "카카오로 계속하기",
};

const ERROR_MESSAGES: Record<string, string> = {
  callback: "로그인 링크가 만료됐거나 이미 쓰였어요. 다시 요청해 주세요.",
  denied: "로그인을 취소했어요.",
  config: "로그인 기능이 아직 설정되지 않았어요.",
};

export function LoginForm({ next, error }: { next: string; error: string | null }) {
  const supabase = getBrowserSupabase();
  const status = useAccountStore((s) => s.status);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [message, setMessage] = useState<string | null>(
    error ? (ERROR_MESSAGES[error] ?? ERROR_MESSAGES.callback!) : null,
  );

  const redirectTo = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  if (!supabase) {
    return (
      <Shell>
        <Nodi mood="sleepy" size={96} decorative />
        <h1 className="text-h2 text-foreground">로그인은 곧 열려요</h1>
        <p className="text-small text-muted-foreground">
          지금은 로그인 없이 이 브라우저에 진도가 저장돼요. 모든 학습을 그대로 할 수 있어요.
        </p>
        <PopButton asChild variant="soft">
          <Link href={next}>학습으로 돌아가기</Link>
        </PopButton>
      </Shell>
    );
  }

  if (status === "user") {
    return (
      <Shell>
        <Nodi mood="happy" size={96} decorative />
        <h1 className="text-h2 text-foreground">이미 로그인했어요</h1>
        <PopButton asChild>
          <Link href={next}>이어서 학습하기</Link>
        </PopButton>
      </Shell>
    );
  }

  if (state === "sent") {
    return (
      <Shell>
        <Nodi mood="cheer" size={96} decorative />
        <h1 className="flex items-center gap-2 text-h2 text-foreground">
          <MailCheck className="size-6 text-primary-strong" aria-hidden />
          메일함을 확인해 주세요
        </h1>
        <p className="text-small text-muted-foreground">
          <strong className="text-foreground">{email}</strong>로 로그인 링크를 보냈어요. 링크를 누르면 바로 이어서
          학습할 수 있어요.
        </p>
        <button
          type="button"
          className="text-small font-bold text-primary-strong underline"
          onClick={() => setState("idle")}
        >
          다른 이메일로 받기
        </button>
      </Shell>
    );
  }

  async function sendLink(event: React.FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setState("sending");
    setMessage(null);
    const { error: sendError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo(), shouldCreateUser: true },
    });
    if (sendError) {
      setState("idle");
      setMessage(
        sendError.status === 429
          ? "잠시 뒤에 다시 시도해 주세요. 메일을 너무 자주 보냈어요."
          : "메일을 보내지 못했어요. 주소를 확인해 주세요.",
      );
      return;
    }
    setState("sent");
  }

  async function withProvider(provider: OAuthProvider) {
    if (!supabase) return;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: redirectTo() },
    });
    if (oauthError) setMessage("소셜 로그인을 시작하지 못했어요.");
  }

  return (
    <Shell>
      <Nodi mood="curious" size={96} decorative />
      <div className="flex flex-col gap-1">
        <h1 className="text-h2 text-foreground">진도를 저장해 볼까요?</h1>
        <p className="text-small text-muted-foreground">
          로그인하면 기기를 바꿔도 이어서 배울 수 있어요. 지금까지 이 브라우저에서 푼 기록도 계정으로 옮겨 드려요.
        </p>
      </div>

      <form onSubmit={(event) => void sendLink(event)} className="flex w-full flex-col gap-3 text-left">
        <label htmlFor="login-email" className="text-small font-bold text-foreground">
          이메일
        </label>
        <input
          id="login-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="h-12 rounded-md border bg-background px-3 text-body text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-4 focus-visible:ring-ring/30"
        />
        <PopButton type="submit" size="lg" disabled={state === "sending" || !email.trim()}>
          <Mail />
          {state === "sending" ? "보내는 중…" : "로그인 링크 받기"}
        </PopButton>
      </form>

      {OAUTH_PROVIDERS.length > 0 && (
        <div className="flex w-full flex-col gap-2">
          <p className="text-caption text-muted-foreground">또는</p>
          {OAUTH_PROVIDERS.map((provider) => (
            <PopButton key={provider} variant="outline" onClick={() => void withProvider(provider)}>
              {PROVIDER_LABELS[provider]}
            </PopButton>
          ))}
        </div>
      )}

      {message && (
        <p role="alert" className="w-full rounded-md bg-danger px-3 py-2 text-small text-danger-foreground">
          {message}
        </p>
      )}

      <Link
        href={next}
        className="inline-flex items-center gap-1 text-small font-bold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        로그인 없이 계속하기
      </Link>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-5 rounded-xl border border-border/70 bg-card px-6 py-8 text-center shadow-soft">
      {children}
    </div>
  );
}
