import type { CallFrame, GridCheckResult, GridSnapshot, JsonValue, VisualizationStep, VizItem } from "@/types";
import { DIRECTIONS, StepRecorder, asStringArray, fail } from "./shared";

function asGrid(value: JsonValue | undefined, allowed: RegExp, allowedText: string): string[] {
  const grid = asStringArray(value, "격자", 1, 8);
  const width = grid[0]?.length ?? 0;
  if (width < 1 || width > 8) fail("격자의 가로 길이는 1~8칸이어야 해요");
  if (grid.some((row) => row.length !== width)) fail("격자의 모든 줄은 길이가 같아야 해요");
  if (grid.some((row) => !allowed.test(row))) fail(`격자에는 ${allowedText}만 쓸 수 있어요`);
  return grid;
}

/* ───────────── 격자 DFS (연결 요소 크기) ─────────────
 * 스텝 문구·줄 번호·상태는 docs/05의 「꽃밭 구역 나누기」 시각화 fixture와 정확히 일치해야 한다.
 */

export const GRID_DFS_PSEUDOCODE = [
  "for 모든 칸 (r, c)를 위→아래, 왼쪽→오른쪽 순서로:",
  "    if (r, c)가 꽃이고 아직 방문하지 않았다면:",
  "        size = dfs(r, c)        # 새 구역 탐색 시작",
  "        sizes에 size 추가",
  "dfs(r, c):",
  "    (r, c)에 방문 표시, size = 1",
  "    for (r, c)의 위·아래·왼쪽·오른쪽 이웃 (nr, nc):",
  "        if 격자 안 and 꽃 and 미방문:",
  "            size += dfs(nr, nc)",
  "    return size",
  "sizes를 오름차순 정렬해서 반환",
];

export function validateGridDfs(input: JsonValue[]): void {
  asGrid(input[0], /^[01]+$/, "0(빈 땅)과 1(꽃)");
}

export function gridDfs(input: JsonValue[]): VisualizationStep[] {
  const cells = input[0] as string[];
  const n = cells.length;
  const m = cells[0]!.length;
  const rec = new StepRecorder();
  const zone = cells.map(() => Array.from({ length: m }, () => 0));
  const frames: { r: number; c: number; size: number }[] = [];
  const sizes: number[] = [];
  let zoneId = 0;

  const snap = (
    action: VisualizationStep["action"],
    message: string,
    codeLine: number,
    cursor: [number, number] | null,
    extra: { checking?: [number, number]; checkResult?: GridCheckResult } = {},
  ) => {
    const grid: GridSnapshot = { cells, zone: zone.map((row) => [...row]), cursor, ...extra };
    const callStack: CallFrame[] = frames.map((f, i) => ({
      id: `dfs-${f.r}-${f.c}`,
      label: `dfs(${f.r}, ${f.c})`,
      locals: { size: f.size },
      status: i === frames.length - 1 ? "active" : "waiting",
    }));
    rec.push(action, message, codeLine, { grid, callStack, variables: { sizes: [...sizes] } });
  };

  const dfs = (r: number, c: number): number => {
    zone[r]![c] = zoneId;
    frames.push({ r, c, size: 1 });
    snap("visit", `(${r}, ${c}) 칸에 방문 표시, size = 1로 시작해요.`, 6, [r, c]);
    for (const [dr, dc, name] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= n || nc < 0 || nc >= m) continue;
      const frame = frames[frames.length - 1]!;
      if (cells[nr]![nc] !== "1") {
        snap("check", `${name} (${nr}, ${nc}) 칸은 빈 땅 → 건너뛰기`, 8, [r, c], {
          checking: [nr, nc],
          checkResult: "blocked",
        });
        continue;
      }
      if (zone[nr]![nc]) {
        snap("check", `${name} (${nr}, ${nc}) 칸은 이미 방문 → 건너뛰기`, 8, [r, c], {
          checking: [nr, nc],
          checkResult: "visited",
        });
        continue;
      }
      snap("check", `${name} (${nr}, ${nc}) 칸은 방문하지 않은 꽃! → dfs(${nr}, ${nc}) 호출`, 9, [r, c], {
        checking: [nr, nc],
        checkResult: "go",
      });
      const sub = dfs(nr, nc);
      frame.size += sub;
      snap("return-to", `dfs(${nr}, ${nc})의 결과 ${sub} → size = ${frame.size}`, 9, [r, c]);
    }
    const frame = frames[frames.length - 1]!;
    snap("return", `더 갈 곳이 없어요. dfs(${r}, ${c})의 결과는 ${frame.size}`, 10, [r, c]);
    frames.pop();
    return frame.size;
  };

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < m; c++) {
      if (cells[r]![c] !== "1") {
        snap("scan", `(${r}, ${c}) 칸은 빈 땅 → 다음 칸으로`, 2, [r, c]);
        continue;
      }
      if (zone[r]![c]) {
        snap("scan", `(${r}, ${c}) 칸은 이미 ${zone[r]![c]}번 구역 → 다음 칸으로`, 2, [r, c]);
        continue;
      }
      zoneId += 1;
      snap("zone-start", `(${r}, ${c}) 칸에서 방문 안 한 꽃 발견! ${zoneId}번 구역 탐색 시작`, 3, [r, c]);
      const size = dfs(r, c);
      sizes.push(size);
      snap("zone-complete", `${zoneId}번 구역 완성! 크기 ${size} → sizes = [${sizes.join(", ")}]`, 4, [r, c]);
    }
  }

  sizes.sort((a, b) => a - b);
  snap("done", `모든 칸 확인 완료! 정렬한 [${sizes.join(", ")}]이 정답이에요.`, 11, null);
  return rec.steps;
}

/* ───────────── 격자 BFS (미로 최단 거리) ───────────── */

export const GRID_BFS_PSEUDOCODE = [
  "dist[S] = 0;  queue = deque([S])",
  "while queue:",
  "    (r, c) = queue.popleft()",
  "    if (r, c) == E: return dist[r][c]     # 도착!",
  "    for (r, c)의 위·아래·왼쪽·오른쪽 이웃 (nr, nc):",
  "        if 격자 안 and 벽 아님 and 처음 보는 칸:",
  "            dist[nr][nc] = dist[r][c] + 1",
  "            queue.append((nr, nc))",
  "return -1                                 # 도착할 수 없어요",
];

export function validateGridBfs(input: JsonValue[]): void {
  const grid = asGrid(input[0], /^[SE.#]+$/, "S(출발), E(도착), .(길), #(벽)");
  const count = (ch: string) => grid.join("").split(ch).length - 1;
  if (count("S") !== 1) fail("출발점 S는 정확히 하나여야 해요");
  if (count("E") !== 1) fail("도착점 E는 정확히 하나여야 해요");
}

function find(grid: string[], ch: string): [number, number] {
  for (const [r, row] of grid.entries()) {
    const c = row.indexOf(ch);
    if (c >= 0) return [r, c];
  }
  return [0, 0];
}

export function gridBfs(input: JsonValue[]): VisualizationStep[] {
  const cells = input[0] as string[];
  const n = cells.length;
  const m = cells[0]!.length;
  const rec = new StepRecorder();
  const [sr, sc] = find(cells, "S");
  const [er, ec] = find(cells, "E");
  const dist: (number | null)[][] = cells.map(() => Array.from({ length: m }, () => null));
  // zone: 1 = 방문(발견)한 칸, 2 = 최단 경로
  const zone = cells.map(() => Array.from({ length: m }, () => 0));
  const parent = new Map<string, [number, number]>();
  const queue: VizItem[] = [];
  let seq = 0;

  const snap = (
    action: VisualizationStep["action"],
    message: string,
    codeLine: number,
    cursor: [number, number] | null,
    extra: { checking?: [number, number]; checkResult?: GridCheckResult } = {},
  ) => {
    rec.push(action, message, codeLine, {
      grid: { cells, zone: zone.map((row) => [...row]), cursor, distance: dist.map((row) => [...row]), ...extra },
      queue: {
        items: queue.map((item) => ({ ...item })),
        highlights: [],
        pointerLabels: queue.length ? [{ itemId: queue[0]!.id, label: "front" }] : [],
      },
      variables: { "큐 길이": queue.length },
    });
  };

  dist[sr]![sc] = 0;
  zone[sr]![sc] = 1;
  queue.push({ id: `q${seq++}`, value: `(${sr}, ${sc})` });
  snap("init", `출발점 (${sr}, ${sc})의 거리는 0. 큐에 넣고 출발해요.`, 1, [sr, sc]);

  while (queue.length > 0) {
    const item = queue.shift()!;
    const [r, c] = (item.value as string)
      .replace(/[()\s]/g, "")
      .split(",")
      .map(Number) as [number, number];
    snap("dequeue", `큐 맨 앞의 (${r}, ${c}) 칸을 꺼내요 (거리 ${dist[r]![c]})`, 3, [r, c]);

    if (r === er && c === ec) {
      const path: [number, number][] = [];
      let cur: [number, number] | undefined = [r, c];
      while (cur) {
        path.push(cur);
        cur = parent.get(`${cur[0]},${cur[1]}`);
      }
      for (const [pr, pc] of path) zone[pr]![pc] = 2;
      snap(
        "done",
        `도착! 최단 거리는 ${dist[r]![c]}칸이에요. 가까운 칸부터 퍼졌으니 처음 닿은 순간이 가장 짧은 길이에요.`,
        4,
        [r, c],
      );
      return rec.steps;
    }

    for (const [dr, dc, name] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= n || nc < 0 || nc >= m) continue;
      if (cells[nr]![nc] === "#") {
        snap("check", `${name} (${nr}, ${nc}) 칸은 벽 → 건너뛰기`, 6, [r, c], {
          checking: [nr, nc],
          checkResult: "blocked",
        });
        continue;
      }
      if (dist[nr]![nc] !== null) {
        snap("check", `${name} (${nr}, ${nc}) 칸은 이미 발견했어요 → 건너뛰기`, 6, [r, c], {
          checking: [nr, nc],
          checkResult: "visited",
        });
        continue;
      }
      dist[nr]![nc] = dist[r]![c]! + 1;
      zone[nr]![nc] = 1;
      parent.set(`${nr},${nc}`, [r, c]);
      queue.push({ id: `q${seq++}`, value: `(${nr}, ${nc})` });
      snap("discover", `${name} (${nr}, ${nc}) 칸을 처음 발견! 거리 ${dist[nr]![nc]}, 큐 뒤에 넣어요`, 8, [r, c], {
        checking: [nr, nc],
        checkResult: "go",
      });
    }
  }

  snap("done", "큐가 비었는데 도착점에 닿지 못했어요 → -1 (길이 막혀 있어요)", 9, null);
  return rec.steps;
}
