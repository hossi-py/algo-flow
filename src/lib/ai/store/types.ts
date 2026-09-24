import type { GeneratedProblem } from "@/types";

/**
 * AI 생성 문제 저장소. 문제(공개부)와 정답 코드(비공개)를 따로 보관하고,
 * 정답 코드는 읽는 메서드가 아예 없다 (클라이언트로 나갈 길을 만들지 않기 위해).
 */
export interface GeneratedProblemStore {
  create(record: GeneratedProblem): Promise<void>;
  /** 진행 상태 갱신 (queued → generating → verifying) */
  update(id: string, patch: Partial<Pick<GeneratedProblem, "status" | "attempts" | "error">>): Promise<void>;
  /** 검증 통과: 정답 코드를 비공개로 저장하고 문제를 공개 상태로 바꾼다 */
  complete(
    id: string,
    result: Pick<GeneratedProblem, "problem" | "attempts" | "verifiedAt">,
    solution: string,
  ): Promise<void>;
  get(id: string): Promise<GeneratedProblem | null>;
  listByOwner(ownerId: string, limit: number): Promise<GeneratedProblem[]>;
  /** since 이후 이 사용자가 요청한 생성 수 (일일 한도) */
  countSince(ownerId: string, since: Date): Promise<number>;
}

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
