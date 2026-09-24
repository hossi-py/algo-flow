import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./env";

/**
 * 서비스 키 클라이언트 (RLS를 우회한다). 진도 기록 RPC·AI 생성 문제 저장처럼
 * 서버가 사용자를 확인한 뒤에만 쓴다. 절대 클라이언트로 보내지 않는다.
 */
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY ?? "";

let admin: SupabaseClient | null = null;

export function isSupabaseAdminConfigured(): boolean {
  return SUPABASE_URL !== "" && SERVICE_KEY !== "";
}

export function getAdminSupabase(): SupabaseClient {
  if (!isSupabaseAdminConfigured()) throw new Error("SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았어요");
  admin ??= createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return admin;
}
