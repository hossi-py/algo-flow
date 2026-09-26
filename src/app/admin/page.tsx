import type { Metadata } from "next";
import { OverviewView } from "@/components/admin/overview-view";
import { getAdmin, requireAdmin } from "@/lib/admin/auth";
import { getOverview } from "@/lib/admin/queries";

export async function generateMetadata(): Promise<Metadata> {
  return (await getAdmin()) ? { title: "운영 현황" } : {};
}

export default async function AdminOverviewPage() {
  await requireAdmin();
  const { overview, errors, flags, fetchedAt } = await getOverview(14);
  return <OverviewView overview={overview} errors={errors} flags={flags} now={fetchedAt} />;
}
