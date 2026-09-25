"use client";

import type { JudgeResult } from "@/types";

/** 예제·공개된 케이스의 print/console.log 출력과 오류 트레이스를 모아 보여 준다 */
export function ConsoleOutput({ result, onJump }: { result: JudgeResult | null; onJump: (line: number) => void }) {
  if (!result) {
    return (
      <p className="px-1 py-6 text-center text-small text-muted-foreground">코드를 실행하면 여기에 출력이 나와요.</p>
    );
  }

  const entries = result.results.map((item, i) => ({ item, i })).filter(({ item }) => item.stdout || item.error);
  const compileError = result.compileError;

  if (entries.length === 0 && !compileError) {
    return (
      <p className="px-1 py-6 text-center text-small text-muted-foreground">
        출력이 없어요. <code className="font-mono">print()</code>나 <code className="font-mono">console.log()</code>로
        값을 찍어 볼 수 있어요.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 font-mono text-code-sm">
      {compileError && (
        <pre className="overflow-x-auto rounded-sm bg-danger/40 px-3 py-2 whitespace-pre-wrap text-foreground">
          {compileError.traceback || `${compileError.type}: ${compileError.message}`}
        </pre>
      )}
      {entries.map(({ item, i }) => (
        <div key={item.testCaseId} className="flex flex-col gap-1">
          <p className="font-sans text-caption font-bold text-muted-foreground">
            {item.visibility === "example" ? "예제" : "테스트"} {i + 1}
          </p>
          {item.stdout && (
            <pre className="max-h-72 overflow-auto rounded-sm bg-muted px-3 py-2 whitespace-pre-wrap text-foreground">
              {item.stdout}
            </pre>
          )}
          {item.error && !compileError && (
            <div className="rounded-sm bg-danger/40 px-3 py-2 text-foreground">
              <pre className="overflow-x-auto whitespace-pre-wrap">
                {item.error.traceback || `${item.error.type}: ${item.error.message}`}
              </pre>
              {item.error.line !== null && (
                <button
                  type="button"
                  onClick={() => item.error?.line != null && onJump(item.error.line)}
                  className="mt-1 font-sans text-caption font-bold text-danger-text underline underline-offset-2"
                >
                  {item.error.line}번째 줄로 이동
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
