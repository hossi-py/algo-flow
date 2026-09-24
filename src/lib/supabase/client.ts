"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, SUPABASE_PUBLIC_KEY, SUPABASE_URL } from "./env";

let client: SupabaseClient | null = null;

/** 브라우저용 클라이언트 (세션은 쿠키에 저장). 설정이 없으면 null */
export function getBrowserSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  client ??= createBrowserClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
  return client;
}
