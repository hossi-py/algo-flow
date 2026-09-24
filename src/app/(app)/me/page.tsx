import type { Metadata } from "next";
import { MeView } from "@/components/me/me-view";

export const metadata: Metadata = { title: "마이페이지" };

export default function MePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-h1 text-foreground">마이페이지</h1>
      <MeView />
    </div>
  );
}
