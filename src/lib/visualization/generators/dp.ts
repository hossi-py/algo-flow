import type { HighlightTone, JsonValue, TableSnapshot, VisualizationStep } from "@/types";
import { StepRecorder, asInt, asString, fail } from "./shared";

type Mark = { row: number; col: number; tone: HighlightTone };

function table(
  cells: (JsonValue | null)[][],
  highlights: Mark[] = [],
  labels: { title?: string; rowLabels?: string[]; colLabels?: string[] } = {},
): TableSnapshot {
  return {
    ...labels,
    cells: cells.map((row) => [...row]),
    highlights,
  };
}

/* ───────────── 계단 오르기 (1차원 표) ───────────── */

export const STAIRS_PSEUDOCODE = [
  "ways = [0] * (n + 1)",
  "ways[0] = 1; ways[1] = 1          # 0칸·1칸까지 가는 방법은 하나",
  "for i in 2 .. n:",
  "    ways[i] = ways[i-1] + ways[i-2]   # 1칸 전에서 한 칸 + 2칸 전에서 두 칸",
  "return ways[n]",
];

export function validateStairs(input: JsonValue[]): void {
  asInt(input[0], "n", 1, 12);
}

export function stairs(input: JsonValue[]): VisualizationStep[] {
  const n = input[0] as number;
  const rec = new StepRecorder();
  const ways: (number | null)[] = Array.from({ length: n + 1 }, () => null);
  const labels = { title: "ways (i칸까지 오는 방법 수)", rowLabels: ["ways"], colLabels: ways.map((_, i) => `${i}칸`) };
  const view = (marks: Mark[] = [], extra: Record<string, JsonValue> = {}) => ({
    table: table([ways], marks, labels),
    variables: { n, ...extra },
  });

  rec.push(
    "init",
    `${n}칸 계단을 1칸 또는 2칸씩 오르는 방법을 세요. i칸까지 오는 방법 수를 표에 적어 가요.`,
    1,
    view(),
  );
  ways[0] = 1;
  ways[1] = 1;
  rec.push(
    "fill",
    "시작점(0칸)에 서 있는 방법, 1칸까지 가는 방법은 하나씩이에요.",
    2,
    view([
      { row: 0, col: 0, tone: "result" },
      { row: 0, col: 1, tone: "result" },
    ]),
  );

  for (let i = 2; i <= n; i++) {
    const a = ways[i - 1]!;
    const b = ways[i - 2]!;
    rec.push(
      "reuse",
      `${i}칸에 오려면 마지막에 1칸(${i - 1}칸에서) 또는 2칸(${i - 2}칸에서) 올라와요. 표에 적어 둔 두 값(${a}, ${b})을 꺼내요.`,
      4,
      view(
        [
          { row: 0, col: i - 1, tone: "frontier" },
          { row: 0, col: i - 2, tone: "frontier" },
          { row: 0, col: i, tone: "current" },
        ],
        { i },
      ),
    );
    ways[i] = a + b;
    rec.push("fill", `ways[${i}] = ${a} + ${b} = ${ways[i]}`, 4, view([{ row: 0, col: i, tone: "result" }], { i }));
  }

  // 표 없이 그대로 재귀하면 fib 호출 수만큼 계산해요
  const calls = (k: number): number => (k <= 1 ? 1 : calls(k - 1) + calls(k - 2) + 1);
  rec.push(
    "done",
    `답은 ${ways[n]}가지. 칸마다 한 번씩 ${n + 1}번만 계산했어요. 표 없이 재귀로 풀면 ${calls(n)}번 호출해요.`,
    5,
    view([{ row: 0, col: n, tone: "result" }]),
  );
  return rec.steps;
}

/* ───────────── 격자 경로 (2차원 표) ───────────── */

export const GRID_PATHS_PSEUDOCODE = [
  "dp[0][0] = 1                        # 출발 칸",
  "for r in 0 .. R-1:",
  "    for c in 0 .. C-1:",
  "        if grid[r][c] == '#': dp[r][c] = 0   # 막힌 칸",
  "        else: dp[r][c] += dp[r-1][c] (위) + dp[r][c-1] (왼쪽)",
  "return dp[R-1][C-1]",
];

function parseGrid(value: JsonValue | undefined): string[] {
  if (!Array.isArray(value) || value.length < 1 || value.length > 6) fail("격자는 1~6줄이어야 해요");
  const rows = value as JsonValue[];
  if (!rows.every((row) => typeof row === "string")) fail("격자의 줄은 문자열이어야 해요");
  const grid = rows as string[];
  const width = grid[0]!.length;
  if (width < 1 || width > 6) fail("격자의 너비는 1~6칸이어야 해요");
  if (grid.some((row) => row.length !== width)) fail("모든 줄의 길이가 같아야 해요");
  if (grid.some((row) => /[^.#]/.test(row))) fail("격자는 . (길)과 # (막힘)만 쓸 수 있어요");
  if (grid[0]![0] === "#" || grid[grid.length - 1]![width - 1] === "#") fail("출발 칸과 도착 칸은 막혀 있으면 안 돼요");
  return grid;
}

export function validateGridPaths(input: JsonValue[]): void {
  parseGrid(input[0]);
}

export function gridPaths(input: JsonValue[]): VisualizationStep[] {
  const grid = parseGrid(input[0]);
  const rows = grid.length;
  const cols = grid[0]!.length;
  const rec = new StepRecorder();
  const dp: (JsonValue | null)[][] = grid.map((row) => [...row].map(() => null));
  const num = (r: number, c: number) =>
    r < 0 || c < 0 ? 0 : typeof dp[r]![c] === "number" ? (dp[r]![c] as number) : 0;
  const labels = { title: "dp (그 칸까지 오는 길의 수)" };
  const view = (marks: Mark[] = []) => ({ table: table(dp, marks, labels) });

  rec.push("init", `왼쪽 위에서 오른쪽 아래까지, 오른쪽·아래로만 가는 길의 수를 세요. # 칸은 못 지나가요.`, 1, view());

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r]![c] === "#") {
        dp[r]![c] = "#";
        rec.push("fill", `(${r}, ${c})는 막힌 칸 → 여기로 오는 길은 0`, 4, view([{ row: r, col: c, tone: "blocked" }]));
        continue;
      }
      if (r === 0 && c === 0) {
        dp[0]![0] = 1;
        rec.push("fill", "출발 칸에 서 있는 방법은 1가지", 1, view([{ row: 0, col: 0, tone: "result" }]));
        continue;
      }
      const up = num(r - 1, c);
      const left = num(r, c - 1);
      const marks: Mark[] = [];
      if (r > 0) marks.push({ row: r - 1, col: c, tone: "frontier" });
      if (c > 0) marks.push({ row: r, col: c - 1, tone: "frontier" });
      dp[r]![c] = up + left;
      rec.push(
        "fill",
        `(${r}, ${c}) = 위 ${up} + 왼쪽 ${left} = ${up + left}`,
        5,
        view([...marks, { row: r, col: c, tone: "current" }]),
      );
    }
  }

  const answer = num(rows - 1, cols - 1);
  rec.push(
    "done",
    `도착 칸까지 ${answer}가지 길이 있어요. 길을 하나씩 따라가지 않고, 칸마다 한 번 더하기만 했어요.`,
    6,
    view([{ row: rows - 1, col: cols - 1, tone: "result" }]),
  );
  return rec.steps;
}

/* ───────────── 가장 긴 공통 부분 수열 (두 문자열 표) ───────────── */

export const LCS_PSEUDOCODE = [
  "dp = (n+1) × (m+1) 표, 0행·0열은 0",
  "for i in 1 .. n:",
  "    for j in 1 .. m:",
  "        if a[i-1] == b[j-1]: dp[i][j] = dp[i-1][j-1] + 1   # 대각선 + 1",
  "        else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])       # 위·왼쪽 중 큰 값",
  "return dp[n][m]",
];

function asWord(value: JsonValue | undefined, name: string): string {
  const word = asString(value, name, 7);
  if (!/^[a-z]+$/.test(word)) fail(`${name}: 영어 소문자만 쓸 수 있어요`);
  return word;
}

export function validateLcs(input: JsonValue[]): void {
  asWord(input[0], "첫 단어");
  asWord(input[1], "둘째 단어");
}

export function lcs(input: JsonValue[]): VisualizationStep[] {
  const a = input[0] as string;
  const b = input[1] as string;
  const n = a.length;
  const m = b.length;
  const rec = new StepRecorder();
  const dp: (number | null)[][] = Array.from({ length: n + 1 }, (_, i) =>
    Array.from({ length: m + 1 }, (_, j) => (i === 0 || j === 0 ? 0 : null)),
  );
  const labels = { title: "dp[i][j] (앞 i글자 · 앞 j글자의 LCS)", rowLabels: ["", ...a], colLabels: ["", ...b] };
  const view = (marks: Mark[] = []) => ({ table: table(dp, marks, labels) });

  rec.push(
    "init",
    `두 단어 ${a} · ${b}의 가장 긴 공통 부분 수열을 찾아요. 빈 문자열과의 답(0행·0열)은 0이에요.`,
    1,
    view(),
  );

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i]![j] = dp[i - 1]![j - 1]! + 1;
        rec.push(
          "fill",
          `${a[i - 1]} = ${b[j - 1]} 같은 글자! 대각선 ${dp[i - 1]![j - 1]} + 1 = ${dp[i]![j]}`,
          4,
          view([
            { row: i - 1, col: j - 1, tone: "frontier" },
            { row: i, col: j, tone: "result" },
          ]),
        );
      } else {
        const up = dp[i - 1]![j]!;
        const left = dp[i]![j - 1]!;
        dp[i]![j] = Math.max(up, left);
        rec.push(
          "fill",
          `${a[i - 1]} ≠ ${b[j - 1]} → 위 ${up}, 왼쪽 ${left} 중 큰 값 ${dp[i]![j]}`,
          5,
          view([
            { row: i - 1, col: j, tone: "frontier" },
            { row: i, col: j - 1, tone: "frontier" },
            { row: i, col: j, tone: "current" },
          ]),
        );
      }
    }
  }

  // 표를 거꾸로 따라가 공통 부분 수열 하나를 찾는다
  const path: Mark[] = [];
  let word = "";
  let i = n;
  let j = m;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      path.push({ row: i, col: j, tone: "result" });
      word = a[i - 1] + word;
      i -= 1;
      j -= 1;
    } else if (dp[i - 1]![j]! >= dp[i]![j - 1]!) i -= 1;
    else j -= 1;
  }
  rec.push(
    "done",
    `길이는 ${dp[n]![m]}. 대각선으로 올라온 칸(같은 글자)을 모으면 공통 부분 수열: ${word || "(없음)"}`,
    6,
    view(path),
  );
  return rec.steps;
}
