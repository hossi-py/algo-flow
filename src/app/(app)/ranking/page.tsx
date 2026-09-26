import type { Metadata } from "next";
import { RankingView } from "@/components/ranking/ranking-view";
import { getWeeklyRanking } from "@/lib/ranking/queries";

export const metadata: Metadata = { title: "이번 주 랭킹" };

export default async function RankingPage() {
  return <RankingView ranking={await getWeeklyRanking()} />;
}
