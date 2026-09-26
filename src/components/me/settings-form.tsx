"use client";

import { useState } from "react";
import { LogOut, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { signOut } from "@/components/auth/user-menu";
import { PopButton } from "@/components/common/pop-button";
import { SectionTitle, SoftCard } from "@/components/common/soft-card";
import { LanguageToggle } from "@/components/workspace/workspace-header";
import { useMounted } from "@/hooks/use-mounted";
import { patchProfile } from "@/lib/progress/remote";
import { cn } from "@/lib/utils";
import { useAccountStore } from "@/stores/account-store";
import { EDITOR_FONT_SIZES, useSettingsStore } from "@/stores/settings-store";

const GOALS = [10, 20, 30, 50, 100] as const;
const THEMES = [
  { value: "light", label: "라이트", icon: Sun },
  { value: "dark", label: "다크", icon: Moon },
  { value: "system", label: "시스템", icon: Monitor },
] as const;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-small font-bold text-foreground">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-caption font-bold transition-colors outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
        active
          ? "border-primary bg-primary-soft text-primary-soft-foreground"
          : "bg-card text-foreground hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}

/** 설정은 이 브라우저에 저장되고, 로그인했으면 프로필에도 저장된다 (AccountSync) */
export function SettingsForm() {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();
  const settings = useSettingsStore();
  const status = useAccountStore((s) => s.status);
  const profile = useAccountStore((s) => s.profile);
  const setAccount = useAccountStore((s) => s.set);
  const [nickname, setNickname] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const nicknameValue = nickname ?? profile?.nickname ?? "";

  async function saveRanking(show: boolean) {
    if (!profile || profile.showInRanking === show) return;
    setSaving(true);
    setMessage(null);
    try {
      const result = await patchProfile({ showInRanking: show });
      setAccount({ profile: result.profile });
      setMessage(show ? "랭킹에 닉네임이 보여요" : "랭킹에서 닉네임을 숨겼어요");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "저장하지 못했어요");
    } finally {
      setSaving(false);
    }
  }

  async function saveNickname(event: React.FormEvent) {
    event.preventDefault();
    const value = nicknameValue.trim();
    if (!value || value === profile?.nickname) return;
    setSaving(true);
    setMessage(null);
    try {
      const result = await patchProfile({ nickname: value });
      setAccount({ profile: result.profile });
      setNickname(null);
      setMessage("닉네임을 바꿨어요");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "저장하지 못했어요");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SoftCard className="flex flex-col gap-5">
      <SectionTitle>설정</SectionTitle>

      {status === "user" && profile && (
        <form
          onSubmit={(event) => void saveNickname(event)}
          className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
        >
          <label htmlFor="nickname" className="text-small font-bold text-foreground">
            닉네임
          </label>
          <div className="flex gap-2">
            <input
              id="nickname"
              value={nicknameValue}
              maxLength={20}
              onChange={(event) => setNickname(event.target.value)}
              className="h-9 w-44 rounded-md border bg-background px-3 text-small text-foreground outline-none focus-visible:ring-4 focus-visible:ring-ring/30"
            />
            <PopButton
              type="submit"
              size="sm"
              variant="soft"
              disabled={saving || !nicknameValue.trim() || nicknameValue.trim() === profile.nickname}
            >
              저장
            </PopButton>
          </div>
        </form>
      )}

      {status === "user" && profile && (
        <Row label="주간 랭킹에 닉네임 보이기">
          <Choice active={profile.showInRanking} onClick={() => void saveRanking(true)}>
            보이기
          </Choice>
          <Choice active={!profile.showInRanking} onClick={() => void saveRanking(false)}>
            숨기기
          </Choice>
        </Row>
      )}

      <Row label="하루 목표 XP">
        {GOALS.map((goal) => (
          <Choice key={goal} active={settings.dailyGoalXp === goal} onClick={() => settings.setDailyGoalXp(goal)}>
            {goal}
          </Choice>
        ))}
      </Row>

      <Row label="테마">
        {THEMES.map((item) => {
          const Icon = item.icon;
          return (
            <Choice key={item.value} active={mounted && theme === item.value} onClick={() => setTheme(item.value)}>
              <Icon className="size-3.5" aria-hidden />
              {item.label}
            </Choice>
          );
        })}
      </Row>

      <Row label="에디터 글자 크기">
        {EDITOR_FONT_SIZES.map((size) => (
          <Choice key={size} active={settings.editorFontSize === size} onClick={() => settings.setEditorFontSize(size)}>
            {size}
          </Choice>
        ))}
      </Row>

      <Row label="주력 언어">
        <div className="flex flex-col gap-1.5">
          <LanguageToggle
            language={settings.language}
            onChange={settings.setLanguage}
            preferred={settings.language}
            label="주력 언어"
          />
          <p className="text-caption text-muted-foreground">
            문제를 열면 이 언어로 시작해요. 문제 화면에서 바꾼 언어는 그 문제에서만 쓰여요.
          </p>
        </div>
      </Row>

      {message && (
        <p className="text-caption text-muted-foreground" role="status">
          {message}
        </p>
      )}

      {status === "user" && (
        <PopButton variant="ghost" size="sm" className="self-start" onClick={() => void signOut()}>
          <LogOut />
          로그아웃
        </PopButton>
      )}
    </SoftCard>
  );
}
