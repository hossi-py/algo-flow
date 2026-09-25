import type { BadgeId, IsoDateTime, Language, PatternStat, SubmissionSummary, UserProgress } from "@/types";

/** 로그인 사용자 프로필 (profiles 테이블 + 이메일·가입일) */
export interface AccountProfile {
  id: string;
  email: string | null;
  nickname: string;
  dailyGoalXp: number;
  theme: "light" | "dark" | "system";
  editorFontSize: number;
  preferredLanguage: Language;
  createdAt: IsoDateTime;
}

/** GET /api/progress */
export interface AccountSnapshotResponse {
  progress: UserProgress;
  profile: AccountProfile;
}

/** 진도를 바꾸는 요청들의 공통 응답: 서버가 계산한 최신 진도 (클라이언트는 이걸로 덮어쓴다) */
export interface ProgressMutationResponse {
  progress: UserProgress;
  earnedBadges: BadgeId[];
}

export interface SubmissionsResponse {
  submissions: SubmissionSummary[];
}

export interface WeaknessResponse {
  stats: PatternStat[];
}
