"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Nodi } from "@/components/mascot/nodi";
import type { JudgeResult, Problem } from "@/types";
import { ConsoleOutput } from "./console-output";
import { TestResultList } from "./test-result-list";
import { VerdictBanner } from "./verdict-banner";

export const SOFT_TABS_LIST = "h-10 w-full justify-start gap-1 rounded-full bg-muted p-1 sm:w-fit";
export const SOFT_TABS_TRIGGER =
  "h-8 flex-none rounded-full px-3.5 text-small font-bold text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-soft";

export function OutputPanel({
  result,
  problem,
  onJump,
}: {
  result: JudgeResult | null;
  problem: Problem;
  onJump: (line: number) => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-3">
      <Tabs defaultValue="tests" className="flex min-h-0 flex-1 flex-col gap-3">
        <TabsList className={SOFT_TABS_LIST}>
          <TabsTrigger value="tests" className={SOFT_TABS_TRIGGER}>
            테스트 결과
          </TabsTrigger>
          <TabsTrigger value="console" className={SOFT_TABS_TRIGGER}>
            콘솔
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tests" className="min-h-0 flex-1 overflow-y-auto">
          {result ? (
            <div className="flex flex-col gap-3">
              <VerdictBanner result={result} />
              <TestResultList result={result} problem={problem} onJump={onJump} />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-6 text-center text-small text-muted-foreground">
              <Nodi mood="curious" size={64} decorative />
              <p>
                <span className="font-bold text-foreground">[예제 실행]</span>으로 먼저 확인하고,
                <br />
                자신 있으면 <span className="font-bold text-foreground">[제출]</span>로 숨은 테스트까지 채점해요.
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="console" className="min-h-0 flex-1 overflow-y-auto">
          <ConsoleOutput result={result} onJump={onJump} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
