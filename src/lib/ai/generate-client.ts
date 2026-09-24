import type { GenerationRequest } from "@/types";
import type { GeneratedProblemSummary, GeneratedProblemView } from "./views";

export class GenerateHttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, { cache: "no-store", ...init });
  const data = (await response.json().catch(() => null)) as (T & { error?: string }) | null;
  if (!response.ok || !data) {
    throw new GenerateHttpError(
      response.status,
      data?.error ?? "서버와 연결하지 못했어요. 잠시 뒤 다시 시도해 주세요.",
    );
  }
  return data;
}

export function createGeneration(body: GenerationRequest) {
  return request<{ id: string; remainingToday: number }>("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function getGeneration(id: string) {
  return request<{ problem: GeneratedProblemView }>(`/api/generate/${id}`);
}

export function listGenerations() {
  return request<{ problems: GeneratedProblemSummary[]; remainingToday: number; aiEnabled: boolean }>("/api/generate");
}
