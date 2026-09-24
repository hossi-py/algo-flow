import type { NextRequest } from "next/server";
import { createServerSupabase, getAuthUser } from "@/lib/supabase/server";

const PROBLEM_KEY = /^(c|g):[A-Za-z0-9_-]{1,80}$/;
const THREAD_LIMIT = 40;

interface CoachMessageRow {
  id: string;
  role: "user" | "assistant";
  content: string;
  hint_level: number;
  mood: string | null;
  created_at: string;
}

/** 로그인 사용자의 문제별 코치 대화 (최근 40개, 오래된 것부터) */
export async function GET(request: NextRequest) {
  const problemKey = request.nextUrl.searchParams.get("problemKey") ?? "";
  if (!PROBLEM_KEY.test(problemKey)) return Response.json({ error: "문제 키가 올바르지 않아요." }, { status: 400 });
  const user = await getAuthUser();
  const supabase = await createServerSupabase();
  if (!user || !supabase) return Response.json({ error: "로그인이 필요해요." }, { status: 401 });

  const { data, error } = await supabase
    .from("coach_messages")
    .select("id, role, content, hint_level, mood, created_at")
    .eq("problem_key", problemKey)
    .order("created_at", { ascending: false })
    .limit(THREAD_LIMIT)
    .returns<CoachMessageRow[]>();
  if (error) return Response.json({ error: "대화를 불러오지 못했어요." }, { status: 500 });

  const messages = (data ?? []).reverse().map((row) => ({
    id: row.id,
    role: row.role,
    content: row.content,
    hintLevel: row.hint_level,
    mood: row.mood,
    createdAt: new Date(row.created_at).toISOString(),
  }));
  return Response.json({ messages });
}
