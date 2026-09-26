import { profilePatchSchema } from "@/lib/progress/api-schemas";
import { badRequest, loadProfile, readJson, requireAccount } from "@/lib/server/account";
import { createServerSupabase } from "@/lib/supabase/server";

/** 내 설정 바꾸기 (사용자 세션으로 — RLS와 컬럼 권한이 설정 항목만 허용) */
export async function PATCH(request: Request) {
  const account = await requireAccount();
  if (account instanceof Response) return account;
  const parsed = profilePatchSchema.safeParse(await readJson(request));
  if (!parsed.success) return badRequest(parsed.error.issues[0]?.message);
  const patch = parsed.data;

  const supabase = await createServerSupabase();
  if (!supabase) return badRequest();
  const { error } = await supabase
    .from("profiles")
    .update({
      ...(patch.nickname !== undefined ? { nickname: patch.nickname } : {}),
      ...(patch.dailyGoalXp !== undefined ? { daily_goal_xp: patch.dailyGoalXp } : {}),
      ...(patch.theme !== undefined ? { theme: patch.theme } : {}),
      ...(patch.editorFontSize !== undefined ? { editor_font_size: patch.editorFontSize } : {}),
      ...(patch.preferredLanguage !== undefined ? { preferred_language: patch.preferredLanguage } : {}),
      ...(patch.showInRanking !== undefined ? { show_in_ranking: patch.showInRanking } : {}),
    })
    .eq("id", account.user.id);
  if (error) return Response.json({ error: "설정을 저장하지 못했어요." }, { status: 500 });
  return Response.json({ profile: await loadProfile(account.user) });
}
