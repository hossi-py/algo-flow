/** 사용자당 하루 AI 문제 생성 한도 (비용 보호, docs/03 §8) */
export const DAILY_GENERATION_LIMIT = 10;

/** AI 코치 하루 질문 한도 (비용 보호) */
export const COACH_DAILY_LIMIT = { guest: 30, user: 100 } as const;
/** 같은 IP에서 게스트로 보낼 수 있는 하루 코치 질문 수 (쿠키를 지워 가며 쓰는 경우 대비) */
export const COACH_DAILY_LIMIT_PER_IP = 60;
