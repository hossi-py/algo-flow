import type { GridSnapshot, HighlightTone, JsonValue, TableSnapshot, VisualizationStep } from "@/types";
import { StepRecorder, asInt, asString, asStringArray, fail } from "./shared";

/* ───────────── 방향을 바꾸며 걷는 로봇 ───────────── */

const ARROWS = ["↑", "→", "↓", "←"];
const DIR_NAMES = ["위", "오른쪽", "아래", "왼쪽"];
const DIR_TO = ["위로", "오른쪽으로", "아래로", "왼쪽으로"];
const DR = [-1, 0, 1, 0];
const DC = [0, 1, 0, -1];

export const SIM_ROBOT_PSEUDOCODE = [
  "dr = [-1, 0, 1, 0];  dc = [0, 1, 0, -1]   # 위 오른쪽 아래 왼쪽",
  "d = 0                                    # 처음엔 위",
  "for cmd in commands:",
  "    if cmd == 'L': d = (d + 3) % 4        # 왼쪽으로 90도",
  "    elif cmd == 'R': d = (d + 1) % 4      # 오른쪽으로 90도",
  "    else:",
  "        nr, nc = r + dr[d], c + dc[d]",
  "        if 격자 안이고 벽이 아니면: r, c = nr, nc",
  "return [r, c]",
];

function parseRobot(input: JsonValue[]) {
  const grid = asStringArray(input[0], "격자", 1, 8);
  const cols = grid[0]!.length;
  if (cols < 1 || cols > 8) fail("격자의 한 줄은 1 ~ 8칸이어야 해요");
  if (grid.some((row) => row.length !== cols)) fail("격자의 모든 줄은 길이가 같아야 해요");
  if (grid.some((row) => /[^.#S]/.test(row))) fail("격자에는 '.', '#', 'S'만 쓸 수 있어요");
  const starts = grid.flatMap((row, r) =>
    [...row].flatMap((ch, c) => (ch === "S" ? [[r, c] as [number, number]] : [])),
  );
  if (starts.length !== 1) fail("출발 칸 'S'가 딱 하나 있어야 해요");
  const commands = asString(input[1], "명령", 20);
  if (/[^LRF]/.test(commands)) fail("명령에는 'L', 'R', 'F'만 쓸 수 있어요");
  return { grid, start: starts[0]!, commands };
}

export function validateSimRobot(input: JsonValue[]): void {
  parseRobot(input);
}

export function simRobot(input: JsonValue[]): VisualizationStep[] {
  const { grid, start, commands } = parseRobot(input);
  const rows = grid.length;
  const cols = grid[0]!.length;
  const rec = new StepRecorder();
  const zone = grid.map((row) => [...row].map(() => 0));
  let [r, c] = start;
  let d = 0;
  zone[r]![c] = 1;

  const state = (checking?: [number, number], blocked?: boolean) => {
    const snapshot: GridSnapshot = { cells: grid, zone: zone.map((row) => [...row]), cursor: [r, c] };
    if (checking) {
      snapshot.checking = checking;
      snapshot.checkResult = blocked ? "blocked" : "go";
    }
    return { grid: snapshot, variables: { 방향: `${ARROWS[d]} (${DIR_NAMES[d]})`, 위치: `(${r}, ${c})` } };
  };

  rec.push("init", `로봇은 (${r}, ${c})에서 위를 보고 있어요. 명령 "${commands}"를 하나씩 따라 해요.`, 2, state());
  [...commands].forEach((cmd, i) => {
    const label = `${i + 1}번째 명령 ${cmd}`;
    if (cmd === "L" || cmd === "R") {
      const before = d;
      d = cmd === "L" ? (d + 3) % 4 : (d + 1) % 4;
      rec.push(
        "turn",
        `${label}: ${cmd === "L" ? "왼쪽" : "오른쪽"}으로 돌아요 (${ARROWS[before]} → ${ARROWS[d]})`,
        cmd === "L" ? 4 : 5,
        state(),
      );
      return;
    }
    const nr = r + DR[d]!;
    const nc = c + DC[d]!;
    const outside = nr < 0 || nr >= rows || nc < 0 || nc >= cols;
    if (outside || grid[nr]![nc] === "#") {
      rec.push(
        "check",
        `${label}: 앞${outside ? "은 격자 밖" : `(${nr}, ${nc})은 벽`}이라 움직이지 않아요`,
        8,
        outside ? state() : state([nr, nc], true),
      );
      return;
    }
    r = nr;
    c = nc;
    zone[r]![c] = 1;
    rec.push("visit", `${label}: ${DIR_TO[d]} 한 칸 → (${r}, ${c})`, 8, state());
  });
  rec.push("done", `명령을 모두 따랐어요. 마지막 위치는 (${r}, ${c})예요.`, 9, state());
  return rec.steps;
}

/* ───────────── 달팽이 모양으로 채우기 ───────────── */

export const SIM_SPIRAL_PSEUDOCODE = [
  "dr = [0, 1, 0, -1];  dc = [1, 0, -1, 0]   # 오른쪽 아래 왼쪽 위",
  "r = c = d = 0",
  "for k in range(1, n * m + 1):",
  "    board[r][c] = k",
  "    nr, nc = r + dr[d], c + dc[d]",
  "    if 밖이거나 이미 채운 칸: d = (d + 1) % 4   # 오른쪽으로 돌아요",
  "    r, c = r + dr[d], c + dc[d]",
];

function parseSpiral(input: JsonValue[]) {
  return { n: asInt(input[0], "줄 수", 1, 6), m: asInt(input[1], "칸 수", 1, 6) };
}

export function validateSimSpiral(input: JsonValue[]): void {
  parseSpiral(input);
}

export function simSpiral(input: JsonValue[]): VisualizationStep[] {
  const { n, m } = parseSpiral(input);
  const rec = new StepRecorder();
  const board: (number | null)[][] = Array.from({ length: n }, () => Array.from({ length: m }, () => null));
  const SDR = [0, 1, 0, -1];
  const SDC = [1, 0, -1, 0];
  const SARROWS = ["→", "↓", "←", "↑"];
  let r = 0;
  let c = 0;
  let d = 0;
  const table = (tone: HighlightTone = "current"): TableSnapshot => ({
    title: "board",
    cells: board.map((row) => [...row]),
    highlights: [{ row: r, col: c, tone }],
  });

  rec.push("init", `${n} × ${m} 판을 1부터 채워요. 오른쪽으로 출발해요.`, 2, {
    table: table(),
    variables: { 방향: SARROWS[d]! },
  });
  for (let k = 1; k <= n * m; k++) {
    board[r]![c] = k;
    rec.push("fill", `${k} 적기 → (${r}, ${c})`, 4, { table: table(), variables: { 방향: SARROWS[d]! } });
    if (k === n * m) break;
    const nr = r + SDR[d]!;
    const nc = c + SDC[d]!;
    if (nr < 0 || nr >= n || nc < 0 || nc >= m || board[nr]![nc] !== null) {
      const before = d;
      d = (d + 1) % 4;
      rec.push(
        "turn",
        `앞이 ${nr < 0 || nr >= n || nc < 0 || nc >= m ? "판 밖" : "이미 채운 칸"}이라 오른쪽으로 돌아요 (${SARROWS[before]} → ${SARROWS[d]})`,
        6,
        { table: table("frontier"), variables: { 방향: SARROWS[d]! } },
      );
    }
    r += SDR[d]!;
    c += SDC[d]!;
  }
  rec.push("done", `${n * m}칸을 모두 채웠어요. 벽이나 채운 칸을 만날 때마다 오른쪽으로 돌면 달팽이 모양이 돼요.`, 7, {
    table: { ...table("result"), highlights: [] },
    variables: { 방향: SARROWS[d]! },
  });
  return rec.steps;
}

/* ───────────── 90도 돌리기 ───────────── */

export const SIM_ROTATE_PSEUDOCODE = [
  "n, m = len(a), len(a[0])",
  "b = m × n 빈 판",
  "for r in range(n):",
  "    for c in range(m):",
  "        b[c][n - 1 - r] = a[r][c]   # r번째 줄이 오른쪽에서 r번째 열로",
  "return b",
];

function parseRotate(input: JsonValue[]) {
  const a = input[0];
  if (!Array.isArray(a) || a.length < 1 || a.length > 5) fail("판은 1 ~ 5줄이어야 해요");
  const m = Array.isArray(a[0]) ? a[0].length : 0;
  if (m < 1 || m > 5) fail("판의 한 줄은 1 ~ 5칸이어야 해요");
  return a.map((row, r) => {
    if (!Array.isArray(row) || row.length !== m) fail(`${r}번 줄의 칸 수가 달라요`);
    if (!row.every((v) => typeof v === "number" && Number.isInteger(v) && Math.abs(v) <= 99)) {
      fail(`${r}번 줄: 칸에는 -99 ~ 99 정수만 쓸 수 있어요`);
    }
    return row as number[];
  });
}

export function validateSimRotate(input: JsonValue[]): void {
  parseRotate(input);
}

export function simRotate(input: JsonValue[]): VisualizationStep[] {
  const a = parseRotate(input);
  const n = a.length;
  const m = a[0]!.length;
  const rec = new StepRecorder();
  const b: (number | null)[][] = Array.from({ length: m }, () => Array.from({ length: n }, () => null));
  const original = Object.fromEntries(a.map((row, r) => [`a ${r}번 줄`, row.join(" ")]));
  const table = (cell: [number, number] | null): TableSnapshot => ({
    title: `b (돌린 결과, ${m} × ${n})`,
    cells: b.map((row) => [...row]),
    highlights: cell ? [{ row: cell[0], col: cell[1], tone: "current" }] : [],
  });

  rec.push("init", `${n} × ${m} 판을 시계 방향으로 90도 돌리면 ${m} × ${n} 판이 돼요.`, 2, {
    table: table(null),
    variables: original,
  });
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < m; c++) {
      b[c]![n - 1 - r] = a[r]![c]!;
      rec.push("place", `a[${r}][${c}] = ${a[r]![c]} → b[${c}][${n - 1 - r}]`, 5, {
        table: table([c, n - 1 - r]),
        variables: original,
      });
    }
  }
  rec.push("done", "다 옮겼어요. 원래 맨 위 줄이 맨 오른쪽 열이 됐어요.", 6, {
    table: table(null),
    variables: original,
  });
  return rec.steps;
}
