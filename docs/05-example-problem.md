# 05. 예시 문제 데이터 — DFS Lv3 「꽃밭 구역 나누기」

> 04 문서의 모델 형식으로 **완전하게** 작성한 문제 1개. 아래 TS 블록들은 04 문서의 타입과 함께 `tsc --strict`로 타입 검사를 통과했다.
> 기대 출력(`expected`)은 손으로 계산하지 않고, 정답 코드와 동일한 알고리즘을 실제로 실행해 만든 값이다.
> JavaScript 정답 코드는 12개 케이스 전부 실제 실행해 통과를 확인했다. Python 정답 코드의 실행 검증은 Step 3의 `scripts/validate-content.ts`가 Pyodide로 수행한다.

## 1. 이 문제가 커리큘럼에서 맡는 역할

| 항목 | 내용 |
| --- | --- |
| 토픽 / 레벨 | DFS · Lv3 대표 유형 |
| 학습 목표 | "이어진 덩어리" 신호를 보고 연결 요소 세기로 판단 → 격자를 그래프로 보고 DFS로 칠하기 |
| 선수 지식 | 재귀 기초(Lv3), 그래프 표현(인접 = 간선), DFS Lv2(그래프 DFS 기본 구현) |
| 같은 레벨 문제 | `dfs-flower-zones`(격자, 4방향) → `dfs-friend-circles`(인접 리스트) → `dfs-lakes-8dir`(격자, 8방향 변형) |
| 흔한 실수 | 방문 표시를 늦게 해서 중복 세기 · 대각선까지 연결로 처리 · 범위 검사 전에 인덱싱 · 정렬 누락 |

## 2. 레벨 정의 (발췌)

```ts
// src/content/topics/dfs.ts (Lv3 정의 발췌)
import type { Level } from "@/types/content";

export const DFS_LEVEL_3: Level = {
  topic: "dfs",
  level: 3,
  stage: "pattern",
  title: "연결 요소 세기",
  goal: "격자와 그래프에서 '이어진 덩어리'를 찾아 개수와 크기를 셀 수 있어요.",
  problemSlugs: ["dfs-flower-zones", "dfs-friend-circles", "dfs-lakes-8dir"],
  clearRule: { minSolved: 2, requiresConcept: false },
};
```

## 3. 유형 인식 신호 (발췌)

```ts
// src/content/signals.ts (이 문제와 관련된 신호 2개 발췌)
import type { PatternSignal } from "@/types/content";

export const SIGNAL_CONNECTED_GROUP: PatternSignal = {
  id: "sig-connected-group",
  phrase: "이어진 덩어리 / 구역 / 그룹의 개수·크기",
  examples: [
    "상하좌우로 맞닿은 칸들은 하나의 구역이에요",
    "서로 연결된 컴퓨터는 같은 네트워크에 속해요",
    "친구의 친구도 같은 모임이에요",
  ],
  suspects: ["dfs", "bfs"],
  patterns: ["connected-components", "grid-flood-fill"],
  reason:
    "한 지점에서 출발해 닿을 수 있는 곳을 전부 칠하면 덩어리 하나가 끝나요. 목적이 '전부 방문'이라 DFS와 BFS 모두 가능하고, 보통 코드가 짧은 DFS를 먼저 떠올려요.",
  caution: "'가장 가까운', '최소 몇 번'이 함께 나오면 거리를 재야 하므로 BFS를 의심하세요.",
  strength: "strong",
};

export const SIGNAL_GRID_NEIGHBORS: PatternSignal = {
  id: "sig-grid-neighbors",
  phrase: "격자(지도) + 상하좌우 이동",
  examples: ["N×M 크기의 지도가 주어져요", "상하좌우로 인접한 칸으로만 이동할 수 있어요"],
  suspects: ["dfs", "bfs"],
  patterns: ["grid-flood-fill", "grid-shortest-path"],
  reason:
    "격자는 '칸 = 노드, 붙어 있는 칸 = 간선'인 그래프예요. 인접 리스트를 따로 만들지 않고 방향 배열 (-1,0), (1,0), (0,-1), (0,1)로 이웃을 구해요.",
  caution: "대각선 포함 여부(4방향 / 8방향)를 문제에서 반드시 확인하세요.",
  strength: "medium",
};
```

## 4. 문제 데이터 (전체)

```ts
// src/content/problems/dfs/flower-zones.ts
import type { Problem } from "@/types/content";

/** 시각화 패널과 힌트3이 함께 쓰는 의사코드 (VisualizationStep.codeLine은 이 배열의 1-based 줄 번호) */
export const FLOWER_ZONES_PSEUDOCODE = [
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

export const flowerZones: Problem = {
  id: "c:dfs-flower-zones",
  slug: "dfs-flower-zones",
  source: "curated",
  topic: "dfs",
  level: 3,
  title: "꽃밭 구역 나누기",
  summary: "상하좌우로 이어진 꽃밭 구역들의 크기를 구해요",
  statement: [
    "정원사 **노디**는 격자 모양 정원에 꽃을 심었어요. 정원은 `N × M` 칸이고, 꽃이 있는 칸은 `'1'`, 빈 칸은 `'0'`으로 표시돼요.",
    "",
    "**상하좌우**로 맞닿은 꽃들은 하나의 **꽃밭 구역**을 이뤄요. 대각선으로만 닿은 꽃은 같은 구역이 아니에요.",
    "",
    "노디는 구역마다 이름표를 붙이려고 해요. 정원 지도 `garden`이 주어질 때, **각 구역에 속한 꽃의 개수를 오름차순으로 정렬한 리스트**를 반환하는 `solution` 함수를 완성해 주세요.",
  ].join("\n"),
  inputFormat:
    "`garden`: 길이가 N인 문자열 리스트예요. 각 문자열의 길이는 M이고 `'0'` 또는 `'1'`로만 이루어져 있어요. `garden[r][c]`는 r행 c열 칸이에요.",
  outputFormat: "각 꽃밭 구역의 크기를 오름차순으로 정렬한 정수 리스트를 반환해요. 꽃이 하나도 없으면 빈 리스트 `[]`를 반환해요.",
  constraints: [
    "1 ≤ N, M ≤ 30",
    "garden의 모든 문자열은 길이가 M으로 같아요.",
    "각 문자는 '0' 또는 '1'이에요.",
  ],
  signature: {
    name: "solution",
    params: [
      {
        name: "garden",
        type: { python: "list[str]", javascript: "string[]" },
        description: "정원 지도 ('1' = 꽃, '0' = 빈 칸)",
      },
    ],
    returns: {
      type: { python: "list[int]", javascript: "number[]" },
      description: "구역 크기의 오름차순 리스트",
    },
  },
  starterCode: {
    python: ["def solution(garden):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(garden) {", "  const answer = [];", "  return answer;", "}", ""].join("\n"),
  },
  testCases: [
    {
      id: "ex-1",
      visibility: "example",
      purpose: "basic",
      args: [
        ["11000", "11001", "00011", "00000", "10110"],
      ],
      expected: [1, 2, 3, 4],
      explanation: "왼쪽 위 4칸, 오른쪽 3칸, 아래쪽 2칸, 왼쪽 아래 1칸 — 네 구역이 있어요. 크기를 오름차순으로 정렬하면 [1, 2, 3, 4]예요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [
        ["000", "000"],
      ],
      expected: [],
      explanation: "꽃이 하나도 없으니 빈 리스트를 반환해요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "edge",
      args: [
        ["1"],
      ],
      expected: [1],
      failureNote: "1×1 격자에 꽃 하나만 있는 경우예요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        ["10", "01"],
      ],
      expected: [1, 1],
      failureNote: "대각선으로만 닿은 꽃은 서로 다른 구역이에요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "edge",
      args: [
        ["1111111111"],
      ],
      expected: [10],
      failureNote: "행이 하나뿐인 격자예요. 위/아래 칸이 범위를 벗어나는지 확인해요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "edge",
      args: [
        ["1", "1", "1", "1", "1", "1", "1", "1"],
      ],
      expected: [8],
      failureNote: "열이 하나뿐인 격자예요. 왼쪽/오른쪽 칸이 범위를 벗어나는지 확인해요.",
    },
    {
      id: "hid-5",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        ["11111", "10001", "10101", "10001", "11111"],
      ],
      expected: [1, 16],
      failureNote: "고리 모양 구역 안에 떨어진 꽃이 하나 있어요.",
    },
    {
      id: "hid-6",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        ["1111111", "0000001", "1111101", "1000101", "1011101", "1000001", "1111111"],
      ],
      expected: [31],
      failureNote: "소용돌이처럼 길게 이어진 한 구역이에요.",
    },
    {
      id: "hid-7",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        ["101010", "010101", "101010", "010101", "101010", "010101"],
      ],
      expected: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      failureNote: "체크무늬라 모든 꽃이 따로 떨어져 있어요.",
    },
    {
      id: "hid-8",
      visibility: "hidden",
      purpose: "basic",
      args: [
        ["1100011100", "1000010000", "0011000110", "0111001110", "0000000000", "1101101011", "1001001001", "0111111000"],
      ],
      expected: [3, 3, 3, 4, 5, 5, 11],
      failureNote: "여러 크기의 구역이 섞여 있어요.",
    },
    {
      id: "hid-9",
      visibility: "hidden",
      purpose: "stress",
      args: [
        [
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
          "111111111111111111111111111111",
        ],
      ],
      expected: [900],
      failureNote: "30×30 전체가 꽃이에요. 재귀가 900단계까지 깊어져요.",
    },
    {
      id: "hid-10",
      visibility: "hidden",
      purpose: "stress",
      args: [
        [
          "111111111111111111111111111111",
          "000000000000000000000000000001",
          "111111111111111111111111111111",
          "100000000000000000000000000000",
          "111111111111111111111111111111",
          "000000000000000000000000000001",
          "111111111111111111111111111111",
          "100000000000000000000000000000",
          "111111111111111111111111111111",
          "000000000000000000000000000001",
          "111111111111111111111111111111",
          "100000000000000000000000000000",
          "111111111111111111111111111111",
          "000000000000000000000000000001",
          "111111111111111111111111111111",
          "100000000000000000000000000000",
          "111111111111111111111111111111",
          "000000000000000000000000000001",
          "111111111111111111111111111111",
          "100000000000000000000000000000",
          "111111111111111111111111111111",
          "000000000000000000000000000001",
          "111111111111111111111111111111",
          "100000000000000000000000000000",
          "111111111111111111111111111111",
          "000000000000000000000000000001",
          "111111111111111111111111111111",
          "100000000000000000000000000000",
          "111111111111111111111111111111",
          "000000000000000000000000000001",
        ],
      ],
      expected: [465],
      failureNote: "30×30을 지그재그로 채운 아주 긴 한 구역이에요.",
    },
  ],
  judge: {
    timeLimitMs: 2000,
    compare: { type: "exact" },
    recursionLimit: 3000,
    revealFirstFailure: true,
  },
  hints: [
    {
      step: 1,
      kind: "pattern",
      title: "이 문제는 어떤 유형일까요?",
      body: [
        "**연결 요소(덩어리) 세기** 유형이에요 → **DFS**(또는 BFS)로 풀 수 있어요.",
        "",
        "**판단 근거**",
        "1. \"상하좌우로 맞닿은 꽃들은 하나의 구역\" → *서로 이어진 덩어리*를 찾으라는 신호예요.",
        "2. \"각 구역에 속한 꽃의 개수\" → 덩어리 하나를 **끝까지 전부** 돌아봐야 해요.",
        "3. \"가장 가까운\", \"최소 몇 번\" 같은 표현이 없어요 → 거리를 잴 필요가 없으니 BFS를 고집할 이유가 없고, 코드가 짧은 DFS가 편해요.",
        "",
        "격자는 **칸 = 노드, 상하좌우로 붙어 있음 = 간선**인 그래프라는 점도 기억해 두세요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. **방문 기록**: N×M 크기의 `visited` 2차원 리스트를 만들어요. 같은 꽃을 두 번 세지 않게 막아줘요.",
        "2. **구역 시작점 찾기**: 모든 칸을 차례로 보면서 *꽃이면서 아직 방문하지 않은 칸*을 만나면, 그 칸이 **새 구역의 시작점**이에요.",
        "3. **구역 전부 칠하기**: 시작점에서 DFS로 상하좌우 이웃 중 꽃인 칸을 계속 따라가며 방문 표시를 하고, 방문한 칸 수를 세요.",
        "4. **방문 표시 타이밍**: 칸에 *들어가자마자* 표시해야 다른 경로로 같은 칸에 다시 들어오지 않아요.",
        "5. **범위 검사 먼저**: 이웃 좌표가 격자 밖이면 `garden[nr][nc]`에 접근하기 전에 걸러야 해요.",
        "",
        "> 재귀 깊이는 최대 N×M = 900이라 재귀 DFS로 충분해요. 격자가 훨씬 크다면 리스트를 스택처럼 써서 반복문 DFS로 바꿀 수 있어요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드로 흐름 잡기",
      body: [
        "아래 흐름을 그대로 파이썬으로 옮겨 보세요. 오른쪽 시각화 패널의 하이라이트 줄 번호와 같아요.",
        "",
        "~~~text",
        ...FLOWER_ZONES_PSEUDOCODE.map((line, i) => `${String(i + 1).padStart(2, " ")}  ${line}`),
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 부분: 이웃 탐색",
      body: "가장 실수하기 쉬운 `dfs` 안쪽이에요. 빈칸 `______`을 채우고, 구역 시작점을 찾는 바깥 반복문과 정렬은 직접 작성해 보세요.",
      code: {
        code: {
          python: [
            "DIRECTIONS = ((-1, 0), (1, 0), (0, -1), (0, 1))  # 위, 아래, 왼쪽, 오른쪽",
            "",
            "def dfs(r, c):",
            "    visited[r][c] = True          # ① 들어오자마자 방문 표시",
            "    size = 1",
            "    for dr, dc in DIRECTIONS:",
            "        nr, nc = r + dr, c + dc",
            "        # ② 범위 검사를 가장 먼저! (IndexError 방지)",
            "        if 0 <= nr < n and 0 <= nc < m:",
            "            if garden[nr][nc] == '1' and not visited[nr][nc]:",
            "                size += ______     # ③ 이웃 쪽 크기를 어떻게 더할까요?",
            "    return size",
          ].join("\n"),
          javascript: [
            "const DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // 위, 아래, 왼쪽, 오른쪽",
            "",
            "function dfs(r, c) {",
            "  visited[r][c] = true;           // ① 들어오자마자 방문 표시",
            "  let size = 1;",
            "  for (const [dr, dc] of DIRECTIONS) {",
            "    const nr = r + dr, nc = c + dc;",
            "    // ② 범위 검사를 가장 먼저! (undefined 접근 방지)",
            "    if (0 <= nr && nr < n && 0 <= nc && nc < m) {",
            "      if (garden[nr][nc] === '1' && !visited[nr][nc]) {",
            "        size += ______;           // ③ 이웃 쪽 크기를 어떻게 더할까요?",
            "      }",
            "    }",
            "  }",
            "  return size;",
            "}",
          ].join("\n"),
        },
        caption: "n, m, visited는 solution 안에서 미리 만들어 두세요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["connected-components", "grid-flood-fill"],
  signalIds: ["sig-connected-group", "sig-grid-neighbors"],
  visualization: {
    presets: [
      {
        id: "flower-zones-mini",
        title: "미니 정원 (3×3)",
        description: "구역 2개짜리 작은 정원에서 DFS가 칸을 칠해 나가는 순서를 봐요.",
        generator: "grid-dfs",
        input: [["110", "010", "001"]],
        pseudocode: FLOWER_ZONES_PSEUDOCODE,
        editableInput: false,
      },
      {
        id: "flower-zones-example-1",
        title: "예제 1 (5×5)",
        description: "예제 1의 정원에서 구역 4개가 차례로 만들어지는 과정을 봐요.",
        generator: "grid-dfs",
        input: [["11000", "11001", "00011", "00000", "10110"]],
        pseudocode: FLOWER_ZONES_PSEUDOCODE,
        editableInput: false,
      },
    ],
  },
  estimatedMinutes: 20,
  xp: 30,
};
```

### 화면에 보이는 모습 (ProblemPanel 렌더링 결과)

> **꽃밭 구역 나누기** `DFS` `Lv3 대표 유형` `약 20분` `30 XP`
>
> 정원사 **노디**는 격자 모양 정원에 꽃을 심었어요. …(statement)
>
> | 예제 | garden | 반환값 |
> | --- | --- | --- |
> | 1 | `["11000", "11001", "00011", "00000", "10110"]` | `[1, 2, 3, 4]` |
> | 2 | `["000", "000"]` | `[]` |

## 5. 정답 코드 (비공개 저장소 경로)

클라이언트 번들에 포함되지 않도록 `src/` 밖에 둔다. 큐레이션 문제는 **Python과 JavaScript 정답을 모두** 두고, CI에서 두 언어 모두 모든 테스트케이스의 `expected`와 일치하는지 재검증한다(언어 간 결과 차이 방지).

```js
// content-solutions/dfs/flower-zones.js
const DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function solution(garden) {
  const n = garden.length;
  const m = garden[0].length;
  const visited = Array.from({ length: n }, () => new Array(m).fill(false));

  function dfs(r, c) {
    visited[r][c] = true;
    let size = 1;
    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      if (0 <= nr && nr < n && 0 <= nc && nc < m && garden[nr][nc] === "1" && !visited[nr][nc]) {
        size += dfs(nr, nc);
      }
    }
    return size;
  }

  const sizes = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < m; c++) {
      if (garden[r][c] === "1" && !visited[r][c]) {
        sizes.push(dfs(r, c));
      }
    }
  }

  return sizes.sort((a, b) => a - b);
}
```

```python
# content-solutions/dfs/flower-zones.py

DIRECTIONS = ((-1, 0), (1, 0), (0, -1), (0, 1))


def solution(garden):
    n, m = len(garden), len(garden[0])
    visited = [[False] * m for _ in range(n)]

    def dfs(r, c):
        visited[r][c] = True
        size = 1
        for dr, dc in DIRECTIONS:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < m and garden[nr][nc] == '1' and not visited[nr][nc]:
                size += dfs(nr, nc)
        return size

    sizes = []
    for r in range(n):
        for c in range(m):
            if garden[r][c] == '1' and not visited[r][c]:
                sizes.append(dfs(r, c))

    return sorted(sizes)
```

## 6. 시각화 스텝 데이터 (미니 정원 프리셋의 전체 출력)

`generator: "grid-dfs"`에 `[["110", "010", "001"]]`을 넣으면 아래 33개 스텝이 나와야 한다. Step 4에서 generator의 스냅샷 테스트 기대값으로 그대로 쓴다.

재생 흐름 요약
| 구간 | 스텝 | 내용 |
| --- | --- | --- |
| 1번 구역 | 0–18 | (0,0) 발견 → dfs(0,0) → dfs(0,1) → dfs(1,1) 로 깊이 들어갔다가 1 → 2 → 3으로 돌아오며 크기 합산 |
| 스캔 | 19–25 | 이미 칠해진 칸과 빈 칸을 건너뜀 |
| 2번 구역 | 26–31 | (2,2) 단독 구역, 크기 1 |
| 완료 | 32 | 정렬 → [1, 3] |

<details>
<summary>전체 스텝 펼치기 (33개)</summary>

```ts
// tests/fixtures/grid-dfs.flower-zones-mini.ts
import type { VisualizationStep } from "@/types/visualization";

/** generator("grid-dfs")에 [["110", "010", "001"]]을 넣었을 때 나와야 하는 전체 스텝 (33개) */
export const FLOWER_ZONES_MINI_STEPS: VisualizationStep[] = [
  {"index":0,"action":"zone-start","message":"(0, 0) 칸에서 방문 안 한 꽃 발견! 1번 구역 탐색 시작","codeLine":3,"state":{"grid":{"cells":["110","010","001"],"zone":[[0,0,0],[0,0,0],[0,0,0]],"cursor":[0,0]},"callStack":[],"variables":{"sizes":[]}}},
  {"index":1,"action":"visit","message":"(0, 0) 칸에 방문 표시, size = 1로 시작해요.","codeLine":6,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,0,0],[0,0,0],[0,0,0]],"cursor":[0,0]},"callStack":[{"id":"dfs-0-0","label":"dfs(0, 0)","locals":{"size":1},"status":"active"}],"variables":{"sizes":[]}}},
  {"index":2,"action":"check","message":"아래 (1, 0) 칸은 빈 땅 → 건너뛰기","codeLine":8,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,0,0],[0,0,0],[0,0,0]],"cursor":[0,0],"checking":[1,0],"checkResult":"blocked"},"callStack":[{"id":"dfs-0-0","label":"dfs(0, 0)","locals":{"size":1},"status":"active"}],"variables":{"sizes":[]}}},
  {"index":3,"action":"check","message":"오른쪽 (0, 1) 칸은 방문하지 않은 꽃! → dfs(0, 1) 호출","codeLine":9,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,0,0],[0,0,0],[0,0,0]],"cursor":[0,0],"checking":[0,1],"checkResult":"go"},"callStack":[{"id":"dfs-0-0","label":"dfs(0, 0)","locals":{"size":1},"status":"active"}],"variables":{"sizes":[]}}},
  {"index":4,"action":"visit","message":"(0, 1) 칸에 방문 표시, size = 1로 시작해요.","codeLine":6,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,0,0],[0,0,0]],"cursor":[0,1]},"callStack":[{"id":"dfs-0-0","label":"dfs(0, 0)","locals":{"size":1},"status":"waiting"},{"id":"dfs-0-1","label":"dfs(0, 1)","locals":{"size":1},"status":"active"}],"variables":{"sizes":[]}}},
  {"index":5,"action":"check","message":"아래 (1, 1) 칸은 방문하지 않은 꽃! → dfs(1, 1) 호출","codeLine":9,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,0,0],[0,0,0]],"cursor":[0,1],"checking":[1,1],"checkResult":"go"},"callStack":[{"id":"dfs-0-0","label":"dfs(0, 0)","locals":{"size":1},"status":"waiting"},{"id":"dfs-0-1","label":"dfs(0, 1)","locals":{"size":1},"status":"active"}],"variables":{"sizes":[]}}},
  {"index":6,"action":"visit","message":"(1, 1) 칸에 방문 표시, size = 1로 시작해요.","codeLine":6,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,0]],"cursor":[1,1]},"callStack":[{"id":"dfs-0-0","label":"dfs(0, 0)","locals":{"size":1},"status":"waiting"},{"id":"dfs-0-1","label":"dfs(0, 1)","locals":{"size":1},"status":"waiting"},{"id":"dfs-1-1","label":"dfs(1, 1)","locals":{"size":1},"status":"active"}],"variables":{"sizes":[]}}},
  {"index":7,"action":"check","message":"위 (0, 1) 칸은 이미 방문 → 건너뛰기","codeLine":8,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,0]],"cursor":[1,1],"checking":[0,1],"checkResult":"visited"},"callStack":[{"id":"dfs-0-0","label":"dfs(0, 0)","locals":{"size":1},"status":"waiting"},{"id":"dfs-0-1","label":"dfs(0, 1)","locals":{"size":1},"status":"waiting"},{"id":"dfs-1-1","label":"dfs(1, 1)","locals":{"size":1},"status":"active"}],"variables":{"sizes":[]}}},
  {"index":8,"action":"check","message":"아래 (2, 1) 칸은 빈 땅 → 건너뛰기","codeLine":8,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,0]],"cursor":[1,1],"checking":[2,1],"checkResult":"blocked"},"callStack":[{"id":"dfs-0-0","label":"dfs(0, 0)","locals":{"size":1},"status":"waiting"},{"id":"dfs-0-1","label":"dfs(0, 1)","locals":{"size":1},"status":"waiting"},{"id":"dfs-1-1","label":"dfs(1, 1)","locals":{"size":1},"status":"active"}],"variables":{"sizes":[]}}},
  {"index":9,"action":"check","message":"왼쪽 (1, 0) 칸은 빈 땅 → 건너뛰기","codeLine":8,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,0]],"cursor":[1,1],"checking":[1,0],"checkResult":"blocked"},"callStack":[{"id":"dfs-0-0","label":"dfs(0, 0)","locals":{"size":1},"status":"waiting"},{"id":"dfs-0-1","label":"dfs(0, 1)","locals":{"size":1},"status":"waiting"},{"id":"dfs-1-1","label":"dfs(1, 1)","locals":{"size":1},"status":"active"}],"variables":{"sizes":[]}}},
  {"index":10,"action":"check","message":"오른쪽 (1, 2) 칸은 빈 땅 → 건너뛰기","codeLine":8,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,0]],"cursor":[1,1],"checking":[1,2],"checkResult":"blocked"},"callStack":[{"id":"dfs-0-0","label":"dfs(0, 0)","locals":{"size":1},"status":"waiting"},{"id":"dfs-0-1","label":"dfs(0, 1)","locals":{"size":1},"status":"waiting"},{"id":"dfs-1-1","label":"dfs(1, 1)","locals":{"size":1},"status":"active"}],"variables":{"sizes":[]}}},
  {"index":11,"action":"return","message":"더 갈 곳이 없어요. dfs(1, 1)의 결과는 1","codeLine":10,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,0]],"cursor":[1,1]},"callStack":[{"id":"dfs-0-0","label":"dfs(0, 0)","locals":{"size":1},"status":"waiting"},{"id":"dfs-0-1","label":"dfs(0, 1)","locals":{"size":1},"status":"waiting"},{"id":"dfs-1-1","label":"dfs(1, 1)","locals":{"size":1},"status":"active"}],"variables":{"sizes":[]}}},
  {"index":12,"action":"return-to","message":"dfs(1, 1)의 결과 1 → size = 2","codeLine":9,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,0]],"cursor":[0,1]},"callStack":[{"id":"dfs-0-0","label":"dfs(0, 0)","locals":{"size":1},"status":"waiting"},{"id":"dfs-0-1","label":"dfs(0, 1)","locals":{"size":2},"status":"active"}],"variables":{"sizes":[]}}},
  {"index":13,"action":"check","message":"왼쪽 (0, 0) 칸은 이미 방문 → 건너뛰기","codeLine":8,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,0]],"cursor":[0,1],"checking":[0,0],"checkResult":"visited"},"callStack":[{"id":"dfs-0-0","label":"dfs(0, 0)","locals":{"size":1},"status":"waiting"},{"id":"dfs-0-1","label":"dfs(0, 1)","locals":{"size":2},"status":"active"}],"variables":{"sizes":[]}}},
  {"index":14,"action":"check","message":"오른쪽 (0, 2) 칸은 빈 땅 → 건너뛰기","codeLine":8,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,0]],"cursor":[0,1],"checking":[0,2],"checkResult":"blocked"},"callStack":[{"id":"dfs-0-0","label":"dfs(0, 0)","locals":{"size":1},"status":"waiting"},{"id":"dfs-0-1","label":"dfs(0, 1)","locals":{"size":2},"status":"active"}],"variables":{"sizes":[]}}},
  {"index":15,"action":"return","message":"더 갈 곳이 없어요. dfs(0, 1)의 결과는 2","codeLine":10,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,0]],"cursor":[0,1]},"callStack":[{"id":"dfs-0-0","label":"dfs(0, 0)","locals":{"size":1},"status":"waiting"},{"id":"dfs-0-1","label":"dfs(0, 1)","locals":{"size":2},"status":"active"}],"variables":{"sizes":[]}}},
  {"index":16,"action":"return-to","message":"dfs(0, 1)의 결과 2 → size = 3","codeLine":9,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,0]],"cursor":[0,0]},"callStack":[{"id":"dfs-0-0","label":"dfs(0, 0)","locals":{"size":3},"status":"active"}],"variables":{"sizes":[]}}},
  {"index":17,"action":"return","message":"더 갈 곳이 없어요. dfs(0, 0)의 결과는 3","codeLine":10,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,0]],"cursor":[0,0]},"callStack":[{"id":"dfs-0-0","label":"dfs(0, 0)","locals":{"size":3},"status":"active"}],"variables":{"sizes":[]}}},
  {"index":18,"action":"zone-complete","message":"1번 구역 완성! 크기 3 → sizes = [3]","codeLine":4,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,0]],"cursor":[0,0]},"callStack":[],"variables":{"sizes":[3]}}},
  {"index":19,"action":"scan","message":"(0, 1) 칸은 이미 1번 구역 → 다음 칸으로","codeLine":2,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,0]],"cursor":[0,1]},"callStack":[],"variables":{"sizes":[3]}}},
  {"index":20,"action":"scan","message":"(0, 2) 칸은 빈 땅 → 다음 칸으로","codeLine":2,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,0]],"cursor":[0,2]},"callStack":[],"variables":{"sizes":[3]}}},
  {"index":21,"action":"scan","message":"(1, 0) 칸은 빈 땅 → 다음 칸으로","codeLine":2,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,0]],"cursor":[1,0]},"callStack":[],"variables":{"sizes":[3]}}},
  {"index":22,"action":"scan","message":"(1, 1) 칸은 이미 1번 구역 → 다음 칸으로","codeLine":2,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,0]],"cursor":[1,1]},"callStack":[],"variables":{"sizes":[3]}}},
  {"index":23,"action":"scan","message":"(1, 2) 칸은 빈 땅 → 다음 칸으로","codeLine":2,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,0]],"cursor":[1,2]},"callStack":[],"variables":{"sizes":[3]}}},
  {"index":24,"action":"scan","message":"(2, 0) 칸은 빈 땅 → 다음 칸으로","codeLine":2,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,0]],"cursor":[2,0]},"callStack":[],"variables":{"sizes":[3]}}},
  {"index":25,"action":"scan","message":"(2, 1) 칸은 빈 땅 → 다음 칸으로","codeLine":2,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,0]],"cursor":[2,1]},"callStack":[],"variables":{"sizes":[3]}}},
  {"index":26,"action":"zone-start","message":"(2, 2) 칸에서 방문 안 한 꽃 발견! 2번 구역 탐색 시작","codeLine":3,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,0]],"cursor":[2,2]},"callStack":[],"variables":{"sizes":[3]}}},
  {"index":27,"action":"visit","message":"(2, 2) 칸에 방문 표시, size = 1로 시작해요.","codeLine":6,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,2]],"cursor":[2,2]},"callStack":[{"id":"dfs-2-2","label":"dfs(2, 2)","locals":{"size":1},"status":"active"}],"variables":{"sizes":[3]}}},
  {"index":28,"action":"check","message":"위 (1, 2) 칸은 빈 땅 → 건너뛰기","codeLine":8,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,2]],"cursor":[2,2],"checking":[1,2],"checkResult":"blocked"},"callStack":[{"id":"dfs-2-2","label":"dfs(2, 2)","locals":{"size":1},"status":"active"}],"variables":{"sizes":[3]}}},
  {"index":29,"action":"check","message":"왼쪽 (2, 1) 칸은 빈 땅 → 건너뛰기","codeLine":8,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,2]],"cursor":[2,2],"checking":[2,1],"checkResult":"blocked"},"callStack":[{"id":"dfs-2-2","label":"dfs(2, 2)","locals":{"size":1},"status":"active"}],"variables":{"sizes":[3]}}},
  {"index":30,"action":"return","message":"더 갈 곳이 없어요. dfs(2, 2)의 결과는 1","codeLine":10,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,2]],"cursor":[2,2]},"callStack":[{"id":"dfs-2-2","label":"dfs(2, 2)","locals":{"size":1},"status":"active"}],"variables":{"sizes":[3]}}},
  {"index":31,"action":"zone-complete","message":"2번 구역 완성! 크기 1 → sizes = [3, 1]","codeLine":4,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,2]],"cursor":[2,2]},"callStack":[],"variables":{"sizes":[3,1]}}},
  {"index":32,"action":"done","message":"모든 칸 확인 완료! 정렬한 [1, 3]이 정답이에요.","codeLine":11,"state":{"grid":{"cells":["110","010","001"],"zone":[[1,1,0],[0,1,0],[0,0,2]],"cursor":null},"callStack":[],"variables":{"sizes":[1,3]}}}
];
```

</details>

## 7. 이 데이터가 각 기능에서 쓰이는 방식

| 기능 | 사용하는 필드 |
| --- | --- |
| 문제 탭 | `title`, `statement`, `inputFormat`, `outputFormat`, `constraints`, `testCases[visibility="example"]` |
| 에디터 초기값 | `starterCode[선택한 언어]` (사용자 초안이 있으면 초안 우선, 초안은 언어별로 따로 저장) |
| 예제 실행 | `testCases[visibility="example"]`, `judge` |
| 제출 채점 | 전체 `testCases`, `judge.compare`, `judge.timeLimitMs`, 틀리면 `failureNote` 표시 |
| 힌트 탭 | `hints[0..3]`, 열 때마다 `xpPenaltyRate` 안내 |
| 시각화 탭 | `visualization.presets` → generator 실행 → `VisualizationStep[]` |
| AI 코치 | `summary`, `patternTags`, `signalIds`, 현재 열린 힌트 단계 (힌트 본문은 열린 단계까지만 전달) |
| 약점 분석 | 제출 시 `patternTags` 스냅샷 → `user_pattern_stats` |
| AI 유사 문제 | `patternTags`, `signalIds`, `level` → `GenerationRequest` |
