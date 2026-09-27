"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { withHiddenData } from "@/content/problems/hidden-data";
import { getRunner, type EngineState } from "@/lib/runner/client";
import { judge } from "@/lib/runner/judge";
import type { JudgeMode, JudgeResult, Language, Problem } from "@/types";

const SERVER_STATE: EngineState = { status: "idle", runtime: null, error: null };

/** 언어별 실행 엔진 상태. 마운트되면 엔진을 미리 준비한다 */
export function useEngine(language: Language): EngineState {
  const runner = typeof window === "undefined" ? null : getRunner(language);
  const state = useSyncExternalStore(
    useCallback((listener: () => void) => (runner ? runner.subscribe(listener) : () => {}), [runner]),
    () => runner?.getState() ?? SERVER_STATE,
    () => SERVER_STATE,
  );
  useEffect(() => {
    void runner?.warmUp();
  }, [runner]);
  return state;
}

export interface JudgeProgress {
  mode: JudgeMode;
  done: number;
  total: number;
}

/** 예제 실행·제출. 동시에 하나만 실행하고, 문제·언어가 바뀌면 이전 결과를 지운다 */
export function useJudge(problem: Problem, language: Language) {
  const [result, setResult] = useState<JudgeResult | null>(null);
  const [progress, setProgress] = useState<JudgeProgress | null>(null);
  const [resultLanguage, setResultLanguage] = useState(language);
  const busy = useRef(false);

  if (resultLanguage !== language) {
    setResultLanguage(language);
    setResult(null);
  }

  const run = useCallback(
    async (mode: JudgeMode, code: string): Promise<JudgeResult | null> => {
      if (busy.current) return null;
      busy.current = true;
      const runner = getRunner(language);
      setProgress({
        mode,
        done: 0,
        total:
          mode === "run"
            ? problem.testCases.filter((t) => t.visibility === "example").length
            : problem.testCases.length,
      });
      try {
        // 숨은 테스트는 입력·정답을 빼고 받았으니, 제출할 때만 불러와 채운다
        const target = mode === "run" ? problem : await withHiddenData(problem);
        const judged = await judge({
          problem: target,
          mode,
          execute: (args) => runner.runCase(code, args, target.judge),
          onProgress: (done, total) => setProgress({ mode, done, total }),
        });
        setResult(judged);
        return judged;
      } finally {
        busy.current = false;
        setProgress(null);
      }
    },
    [language, problem],
  );

  return { result, progress, run, clearResult: () => setResult(null) };
}
