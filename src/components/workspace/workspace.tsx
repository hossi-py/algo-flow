"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDefaultLayout } from "react-resizable-panels";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProblem } from "@/content/problems";
import { getTopic } from "@/content/topics";
import { DESKTOP_QUERY, useMediaQuery } from "@/hooks/use-media-query";
import { useMounted } from "@/hooks/use-mounted";
import { useProgress, useTopicViews } from "@/hooks/use-progress";
import { useEngine, useJudge } from "@/hooks/use-runner";
import { toLocalDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import { LEVEL_CLEAR_DELAY_MS, useCelebrationStore } from "@/stores/celebration-store";
import { useProgressStore } from "@/stores/progress-store";
import { useSettingsStore } from "@/stores/settings-store";
import { draftKey, useWorkspaceStore } from "@/stores/workspace-store";
import type { CodeError, HintStep, JudgeMode, Language, Problem } from "@/types";
import { CodeEditor, type EditorApi } from "./code-editor";
import { HintStack } from "./hint-stack";
import { OutputPanel, SOFT_TABS_LIST, SOFT_TABS_TRIGGER } from "./output-panel";
import { ProblemPanel } from "./problem-panel";
import { EngineStatusLine, RunBar } from "./run-bar";
import { CoachPlaceholder, VisualPanel } from "./side-placeholders";
import { WorkspaceHeader } from "./workspace-header";

const DRAFT_SAVE_DELAY_MS = 400;

function fileName(problem: Problem, language: Language) {
  return `${problem.slug}.${language === "python" ? "py" : "js"}`;
}

/** 채점 결과에서 에디터에 표시할 오류 하나 */
function firstError(result: ReturnType<typeof useJudge>["result"]): CodeError | null {
  if (!result) return null;
  if (result.compileError) return result.compileError;
  return result.results.find((r) => r.error)?.error ?? null;
}

export function Workspace({ slug }: { slug: string }) {
  const problem = getProblem(slug);
  const mounted = useMounted();
  const { hydrated } = useProgress();
  if (!problem) return null;
  if (!mounted || !hydrated) return <WorkspaceSkeleton />;
  return <WorkspaceBody problem={problem} />;
}

function WorkspaceBody({ problem }: { problem: Problem }) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const fontSize = useSettingsStore((s) => s.editorFontSize);
  const setFontSize = useSettingsStore((s) => s.setEditorFontSize);
  const draft = useWorkspaceStore((s) => s.drafts[draftKey(problem.id, language)]);
  const setDraft = useWorkspaceStore((s) => s.setDraft);
  const clearDraft = useWorkspaceStore((s) => s.clearDraft);
  const problemProgress = useProgressStore((s) => s.progress.problems[problem.id]);
  const openHint = useProgressStore((s) => s.openHint);
  const recordSubmission = useProgressStore((s) => s.recordSubmission);
  const celebrate = useCelebrationStore((s) => s.celebrate);

  const engine = useEngine(language);
  const { result, progress, run } = useJudge(problem, language);
  const editorApi = useRef<EditorApi | null>(null);
  const saveTimer = useRef<number | null>(null);
  const [leftTab, setLeftTab] = useState("problem");
  const [mobileTab, setMobileTab] = useState("problem");

  const starter = problem.starterCode[language];
  const opened = problemProgress?.maxHintOpened ?? 0;
  const solved = problemProgress?.status === "solved";
  const error = useMemo(() => firstError(result), [result]);
  const topic = getTopic(problem.topic);
  const topicViews = useTopicViews();
  const topicView = topicViews.find((v) => v.topic === problem.topic);
  const levelView = topicView?.levels[problem.level - 1];
  const lockedReason = levelView?.status === "locked" ? (topicView?.lockedReason ?? levelView.lockedReason) : null;

  // 코드 초안 저장 (입력이 멈추면 저장, 시작 코드와 같으면 지움)
  const saveDraft = useCallback(
    (code: string) => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        if (code === starter) clearDraft(problem.id, language);
        else setDraft(problem.id, language, code);
      }, DRAFT_SAVE_DELAY_MS);
    },
    [clearDraft, language, problem.id, setDraft, starter],
  );
  useEffect(
    () => () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    },
    [],
  );

  const handleJudge = useCallback(
    async (mode: JudgeMode) => {
      const code = editorApi.current?.getValue() ?? draft ?? starter;
      if (!isDesktop) setMobileTab("code");
      const judged = await run(mode, code);
      if (!judged || mode !== "submit") return;

      const now = new Date();
      const outcome = recordSubmission({
        problem,
        verdict: judged.verdict,
        runtimeMs: judged.verdict === "accepted" ? judged.totalTimeMs : null,
        today: toLocalDate(now),
        now: now.toISOString(),
      });
      if (outcome.firstSolve) {
        celebrate({
          title: "정답이에요!",
          message: opened === 0 ? "힌트 없이 풀었어요. 대단해요!" : `힌트 ${opened}단계까지 보고 끝까지 해냈어요`,
          xp: outcome.xpAwarded,
          mood: "happy",
          color: topic?.color,
        });
      }
      if (outcome.levelCleared) {
        const unlocked = outcome.unlockedTopic ? getTopic(outcome.unlockedTopic) : undefined;
        window.setTimeout(() => {
          celebrate({
            title: `Lv${outcome.levelCleared} 클리어!`,
            message: unlocked ? `「${unlocked.title}」 토픽이 새로 열렸어요` : "다음 레벨이 열렸어요",
            mood: "cheer",
            color: topic?.color,
          });
        }, LEVEL_CLEAR_DELAY_MS);
      }
    },
    [celebrate, draft, isDesktop, opened, problem, recordSubmission, run, starter, topic?.color],
  );

  const handleReset = () => editorApi.current?.replaceAll(starter);
  const handleJump = (line: number) => {
    if (!isDesktop) setMobileTab("code");
    window.setTimeout(() => editorApi.current?.revealLine(line), 50);
  };
  const handleOpenHint = (step: HintStep) => openHint(problem, step, new Date().toISOString());

  const editor = (
    <CodeEditor
      key={language}
      path={fileName(problem, language)}
      language={language}
      defaultValue={draft ?? starter}
      fontSize={fontSize}
      error={error}
      onChange={saveDraft}
      onReady={(api) => {
        editorApi.current = api;
      }}
      onRunShortcut={() => void handleJudge("run")}
      onSubmitShortcut={() => void handleJudge("submit")}
    />
  );

  const runBar = (
    <RunBar
      language={language}
      engine={engine}
      progress={progress}
      onRun={() => void handleJudge("run")}
      onSubmit={() => void handleJudge("submit")}
      onReset={handleReset}
    />
  );

  const leftTabs = (
    <Tabs value={leftTab} onValueChange={setLeftTab} className="flex h-full min-h-0 flex-col gap-0">
      <div className="shrink-0 border-b px-3 py-2.5">
        <TabsList className={SOFT_TABS_LIST}>
          <TabsTrigger value="problem" className={SOFT_TABS_TRIGGER}>
            문제
          </TabsTrigger>
          <TabsTrigger value="hints" className={SOFT_TABS_TRIGGER}>
            힌트 {opened > 0 && <span className="tabular">{opened}/4</span>}
          </TabsTrigger>
          <TabsTrigger value="coach" className={SOFT_TABS_TRIGGER}>
            AI 코치
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="problem" className="min-h-0 flex-1 overflow-y-auto">
        <ProblemPanel problem={problem} language={language} lockedReason={lockedReason} />
      </TabsContent>
      <TabsContent value="hints" className="min-h-0 flex-1 overflow-y-auto">
        <HintStack problem={problem} language={language} opened={opened} solved={solved} onOpen={handleOpenHint} />
      </TabsContent>
      <TabsContent value="coach" className="min-h-0 flex-1 overflow-y-auto">
        <CoachPlaceholder />
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="flex h-dvh flex-col bg-background">
      <WorkspaceHeader
        problem={problem}
        solved={solved}
        language={language}
        onLanguageChange={setLanguage}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />
      {isDesktop ? (
        <DesktopLayout
          left={leftTabs}
          editor={editor}
          runBar={runBar}
          output={<OutputPanel result={result} problem={problem} onJump={handleJump} />}
          right={<VisualPanel problem={problem} />}
        />
      ) : (
        <Tabs value={mobileTab} onValueChange={setMobileTab} className="flex min-h-0 flex-1 flex-col gap-0">
          <div className="shrink-0 border-b bg-card px-3 py-2">
            <TabsList className={cn(SOFT_TABS_LIST, "grid grid-cols-3")}>
              <TabsTrigger value="problem" className={SOFT_TABS_TRIGGER}>
                문제
              </TabsTrigger>
              <TabsTrigger value="code" className={SOFT_TABS_TRIGGER}>
                코드
              </TabsTrigger>
              <TabsTrigger value="visual" className={SOFT_TABS_TRIGGER}>
                시각화
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="problem" className="min-h-0 flex-1">
            {leftTabs}
          </TabsContent>
          <TabsContent value="code" className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-[240px] flex-[3] bg-card">{editor}</div>
            <div className="min-h-0 flex-[2] overflow-hidden border-t">
              <OutputPanel result={result} problem={problem} onJump={handleJump} />
            </div>
            <EngineStatusLine language={language} engine={engine} progress={progress} />
            <div className="pb-[env(safe-area-inset-bottom)]">{runBar}</div>
          </TabsContent>
          <TabsContent value="visual" className="min-h-0 flex-1">
            <VisualPanel problem={problem} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

const PANEL = "h-full min-h-0 overflow-hidden rounded-xl border border-border/70 bg-card shadow-soft";
const HANDLE =
  "w-2 bg-transparent after:w-2 aria-[orientation=horizontal]:h-2 aria-[orientation=horizontal]:w-full [&>div]:bg-border hover:[&>div]:bg-primary";

function DesktopLayout({
  left,
  editor,
  runBar,
  output,
  right,
}: {
  left: React.ReactNode;
  editor: React.ReactNode;
  runBar: React.ReactNode;
  output: React.ReactNode;
  right: React.ReactNode;
}) {
  const main = useDefaultLayout({ id: "algo-flow:workspace-main", panelIds: ["left", "center", "right"] });
  const center = useDefaultLayout({ id: "algo-flow:workspace-center", panelIds: ["editor", "output"] });

  return (
    <div className="min-h-0 flex-1 p-2">
      <ResizablePanelGroup
        orientation="horizontal"
        defaultLayout={main.defaultLayout}
        onLayoutChanged={main.onLayoutChanged}
      >
        <ResizablePanel id="left" defaultSize="30" minSize={280}>
          <section aria-label="문제와 힌트" className={PANEL}>
            {left}
          </section>
        </ResizablePanel>
        <ResizableHandle withHandle className={HANDLE} />
        <ResizablePanel id="center" defaultSize="42" minSize={360}>
          <ResizablePanelGroup
            orientation="vertical"
            defaultLayout={center.defaultLayout}
            onLayoutChanged={center.onLayoutChanged}
          >
            <ResizablePanel id="editor" defaultSize="62" minSize={180}>
              <section aria-label="코드 에디터" className={cn(PANEL, "flex flex-col")}>
                <div className="min-h-0 flex-1">{editor}</div>
                {runBar}
              </section>
            </ResizablePanel>
            <ResizableHandle withHandle className={HANDLE} />
            <ResizablePanel id="output" defaultSize="38" minSize={120}>
              <section aria-label="실행 결과" className={PANEL}>
                {output}
              </section>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle className={HANDLE} />
        <ResizablePanel id="right" defaultSize="28" minSize={260}>
          <section aria-label="시각화" className={PANEL}>
            {right}
          </section>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function WorkspaceSkeleton() {
  return (
    <div className="flex h-dvh flex-col" aria-busy="true" aria-label="문제 풀이 화면을 불러오는 중">
      <div className="h-14 shrink-0 border-b bg-card" />
      <div className="grid min-h-0 flex-1 gap-2 p-2 lg:grid-cols-[30fr_42fr_28fr]">
        <div className="animate-pulse rounded-xl bg-muted" />
        <div className="hidden animate-pulse rounded-xl bg-muted lg:block" />
        <div className="hidden animate-pulse rounded-xl bg-muted lg:block" />
      </div>
    </div>
  );
}
