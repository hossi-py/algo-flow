/**
 * 아직 만들지 않은 화면으로 가는 링크를 한곳에서 제어한다.
 * 각 Step에서 해당 기능을 완성하면 값을 true로 바꾼다.
 */
export const FEATURES = {
  /** Step 3: 문제 풀이 워크스페이스 (/problems/[slug]) */
  workspace: false,
  /** Step 4: 개념 카드 · 시각화 탐색 · 유형 인식 훈련 (/topics/[topic]/learn) */
  learn: false,
  /** Step 5: AI 맞춤 문제 (/ai-lab) */
  aiLab: false,
  /** Step 6: 로그인 · 마이페이지 (/me) */
  account: false,
} as const;

export type FeatureKey = keyof typeof FEATURES;

export const FEATURE_ETA: Record<FeatureKey, string> = {
  workspace: "문제 풀이 화면은 곧 열려요",
  learn: "개념 학습은 곧 열려요",
  aiLab: "AI 맞춤 문제는 곧 열려요",
  account: "마이페이지는 곧 열려요",
};
