import type { Metadata } from "next";
import { RoadmapView } from "@/components/roadmap/roadmap-view";

export const metadata: Metadata = { title: "로드맵" };

export default function RoadmapPage() {
  return <RoadmapView />;
}
