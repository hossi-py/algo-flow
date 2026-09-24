import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // 정적 파일·이미지·워커는 건너뛴다
  matcher: ["/((?!_next/static|_next/image|workers/|icon.svg|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|mjs)$).*)"],
};
