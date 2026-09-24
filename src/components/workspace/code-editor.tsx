"use client";

import { useEffect, useRef } from "react";
import Editor, { loader, type BeforeMount, type OnMount } from "@monaco-editor/react";
import type { editor as MonacoEditor } from "monaco-editor";
import { useTheme } from "next-themes";
import { Nodi } from "@/components/mascot/nodi";
import { LANGUAGE_LABELS, type CodeError, type Language } from "@/types";
import { ALGO_DARK_THEME, ALGO_LIGHT_THEME } from "./editor-theme";

/** CDN에서 받는 Monaco 버전 고정 (devDependency monaco-editor와 같은 버전) */
loader.config({ paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs" } });

type Monaco = Parameters<BeforeMount>[0];

export interface EditorApi {
  getValue: () => string;
  /** 되돌리기(Ctrl+Z)가 가능하도록 전체 내용을 바꾼다 */
  replaceAll: (code: string) => void;
  revealLine: (line: number) => void;
  focus: () => void;
}

interface CodeEditorProps {
  /** 문제·언어마다 다른 모델(되돌리기 기록 포함)을 쓰기 위한 경로 */
  path: string;
  language: Language;
  defaultValue: string;
  fontSize: number;
  /** 에디터에 빨간 밑줄로 표시할 오류 */
  error: CodeError | null;
  onChange: (code: string) => void;
  onReady: (api: EditorApi) => void;
  onRunShortcut: () => void;
  onSubmitShortcut: () => void;
}

function readMonoFont(): string {
  if (typeof window === "undefined") return "monospace";
  const value = getComputedStyle(document.documentElement).getPropertyValue("--font-jetbrains-mono").trim();
  return value ? `${value}, ui-monospace, Consolas, monospace` : "ui-monospace, Consolas, monospace";
}

export function CodeEditor({
  path,
  language,
  defaultValue,
  fontSize,
  error,
  onChange,
  onReady,
  onRunShortcut,
  onSubmitShortcut,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  // 단축키 콜백은 최신 값을 쓰도록 ref로 보관
  const shortcuts = useRef({ onRunShortcut, onSubmitShortcut });
  useEffect(() => {
    shortcuts.current = { onRunShortcut, onSubmitShortcut };
  }, [onRunShortcut, onSubmitShortcut]);

  const beforeMount: BeforeMount = (monaco) => {
    monaco.editor.defineTheme("algo-light", ALGO_LIGHT_THEME);
    monaco.editor.defineTheme("algo-dark", ALGO_DARK_THEME);
  };

  const onMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => shortcuts.current.onRunShortcut());
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () =>
      shortcuts.current.onSubmitShortcut(),
    );
    onReady({
      getValue: () => editor.getValue(),
      replaceAll: (code) => {
        const model = editor.getModel();
        if (!model) return;
        editor.pushUndoStop();
        editor.executeEdits("reset", [{ range: model.getFullModelRange(), text: code }]);
        editor.pushUndoStop();
      },
      revealLine: (line) => {
        editor.revealLineInCenter(line);
        editor.setPosition({ lineNumber: line, column: 1 });
        editor.focus();
      },
      focus: () => editor.focus(),
    });
  };

  // 오류 줄 표시
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const model = editor?.getModel();
    if (!editor || !monaco || !model) return;
    const markers =
      error && error.line !== null && error.line <= model.getLineCount()
        ? [
            {
              startLineNumber: error.line,
              endLineNumber: error.line,
              startColumn: model.getLineFirstNonWhitespaceColumn(error.line) || 1,
              endColumn: model.getLineMaxColumn(error.line),
              message: `${error.type}: ${error.message}`,
              severity: monaco.MarkerSeverity.Error,
            },
          ]
        : [];
    monaco.editor.setModelMarkers(model, "algo-flow", markers);
  }, [error, path]);

  return (
    <Editor
      path={path}
      language={language}
      defaultValue={defaultValue}
      theme={resolvedTheme === "dark" ? "algo-dark" : "algo-light"}
      beforeMount={beforeMount}
      onMount={onMount}
      onChange={(value) => onChange(value ?? "")}
      loading={
        <div className="flex flex-col items-center gap-2 text-small text-muted-foreground">
          <Nodi mood="loading" size={56} decorative />
          에디터를 불러오고 있어요
        </div>
      }
      options={{
        fontFamily: readMonoFont(),
        fontSize,
        lineHeight: Math.round(fontSize * 1.6),
        fontLigatures: false,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: language === "javascript" ? 2 : 4,
        insertSpaces: true,
        padding: { top: 14, bottom: 14 },
        renderLineHighlight: "all",
        smoothScrolling: true,
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
        roundedSelection: true,
        wordWrap: "off",
        fixedOverflowWidgets: true,
        "semanticHighlighting.enabled": false,
        guides: { indentation: true, bracketPairs: false },
        scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
        ariaLabel: `${LANGUAGE_LABELS[language]} 코드 에디터`,
      }}
    />
  );
}
