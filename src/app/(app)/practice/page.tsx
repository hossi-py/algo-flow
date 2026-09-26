import type { Metadata } from "next";
import { PracticeView } from "@/components/practice/practice-view";

export const metadata: Metadata = { title: "섞어 풀기" };

export default function PracticePage() {
  return <PracticeView />;
}
