import "server-only";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { createFileStore } from "./file-store";
import { createSupabaseStore } from "./supabase-store";
import type { GeneratedProblemStore } from "./types";

const globalStore = globalThis as typeof globalThis & { __algoFlowGeneratedStore?: GeneratedProblemStore };

/** Supabase가 설정돼 있으면 DB, 아니면 개발용 파일 저장소(.data/) */
export function getGeneratedStore(): GeneratedProblemStore {
  return (globalStore.__algoFlowGeneratedStore ??= isSupabaseAdminConfigured()
    ? createSupabaseStore()
    : createFileStore());
}
