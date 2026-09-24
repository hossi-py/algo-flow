"use client";

import { useAccountStore } from "@/stores/account-store";
import type { UserProgress } from "@/types";
import type { AccountProfile, AccountSnapshotResponse, ProgressMutationResponse } from "./account";

/**
 * 로그인 사용자의 진도 쓰기를 서버로 보낸다. 화면은 이미 같은 규칙으로 먼저 바뀌어 있고(낙관적 반영),
 * 서버가 계산해 저장한 진도가 오면 그걸로 덮어쓴다. 요청은 순서대로 하나씩 보낸다.
 */

let applyProgress: (progress: UserProgress) => void = () => {};

/** progress-store가 시작할 때 연결한다 (순환 import를 피하려고 주입) */
export function connectProgressSink(sink: (progress: UserProgress) => void) {
  applyProgress = sink;
}

let queue: Promise<unknown> = Promise.resolve();

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    cache: "no-store",
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const data = (await response.json().catch(() => null)) as (T & { error?: string }) | null;
  if (!response.ok || !data) throw new Error(data?.error ?? `요청 실패 (${response.status})`);
  return data;
}

export function fetchAccountSnapshot() {
  return request<AccountSnapshotResponse>("/api/progress");
}

export function mergeGuestProgress(body: unknown) {
  return request<ProgressMutationResponse>("/api/progress/merge", { method: "POST", body: JSON.stringify(body) });
}

export function patchProfile(patch: Partial<Omit<AccountProfile, "id" | "email" | "createdAt">>) {
  return request<{ profile: AccountProfile }>("/api/profile", { method: "PATCH", body: JSON.stringify(patch) });
}

/** 서버 진도로 다시 맞춘다 (동기화 실패 뒤 등) */
export async function refreshAccountProgress(): Promise<void> {
  const snapshot = await fetchAccountSnapshot();
  applyProgress(snapshot.progress);
  useAccountStore.getState().set({ profile: snapshot.profile });
}

/** 진도 변경을 서버에 보낸다. 실패하면 안내하고 서버 진도로 되돌린다 */
export function pushProgress(path: string, body: unknown): Promise<void> {
  const task = queue.then(async () => {
    try {
      const data = await request<ProgressMutationResponse>(path, { method: "POST", body: JSON.stringify(body) });
      applyProgress(data.progress);
      useAccountStore.getState().set({ syncError: null });
    } catch (error) {
      useAccountStore.getState().set({
        syncError: `진도를 저장하지 못했어요. ${error instanceof Error ? error.message : ""}`.trim(),
      });
      await refreshAccountProgress().catch(() => undefined);
    }
  });
  queue = task;
  return task;
}
