import "server-only";
import type { User } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getAdminSupabase, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/supabase/server";

/**
 * 요청한 사람이 관리자면 그 사용자, 아니면 null.
 * 로그인 토큰은 Supabase Auth 서버에서 검증하고(getAuthUser), 관리자 여부는 service role로 admins 테이블에서 확인한다.
 * 한 요청 안에서는 한 번만 확인한다.
 */
export const getAdmin = cache(async (): Promise<User | null> => {
  if (!isSupabaseAdminConfigured()) return null;
  const user = await getAuthUser();
  if (!user) return null;
  const { data, error } = await getAdminSupabase()
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) {
    console.warn("[admin] 관리자 확인 실패", error.message);
    return null;
  }
  return data ? user : null;
});

/**
 * 관리자 화면·관리자 데이터를 쓰기 전에 부른다. 관리자가 아니면 404
 * (관리자 화면이 있다는 사실도 드러내지 않는다).
 */
export async function requireAdmin(): Promise<User> {
  const admin = await getAdmin();
  if (!admin) notFound();
  return admin;
}
