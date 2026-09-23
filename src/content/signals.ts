import type { PatternSignal } from "@/types";

/** "문제에 이런 표현이 나오면 이 알고리즘을 의심하라" 신호 목록 */
export const SIGNALS: PatternSignal[] = [
  {
    id: "sig-bracket-pair",
    phrase: "괄호·태그처럼 짝이 맞아야 하는 구조",
    examples: ["올바른 괄호 문자열인지 판단하세요", "여는 태그와 닫는 태그의 짝이 맞는지 확인하세요"],
    suspects: ["stack"],
    patterns: ["bracket-matching"],
    reason: "닫는 괄호는 항상 '가장 최근에 열린' 괄호와 짝이 돼요. 가장 최근 것을 먼저 꺼내는 구조가 바로 스택이에요.",
    caution: "괄호 종류가 한 가지뿐이면 스택 없이 개수 세기로도 풀 수 있어요.",
    strength: "strong",
  },
  {
    id: "sig-latest-first",
    phrase: "가장 최근 것 / 되돌리기 / 직전 값",
    examples: ["실행 취소(Undo)를 구현하세요", "바로 앞의 값과 비교해 지워 나가세요"],
    suspects: ["stack"],
    patterns: ["undo-history", "stack-simulation"],
    reason: "나중에 들어온 것을 먼저 처리해야 하면(LIFO) 스택이 가장 자연스러워요.",
    strength: "medium",
  },
  {
    id: "sig-arrival-order",
    phrase: "먼저 온 순서대로 처리 / 차례대로 돌아가며",
    examples: ["도착한 순서대로 처리하세요", "맨 앞 사람을 맨 뒤로 보내는 과정을 반복해요"],
    suspects: ["queue-deque"],
    patterns: ["queue-simulation", "round-robin"],
    reason: "먼저 들어온 것이 먼저 나가는(FIFO) 흐름은 큐로 그대로 옮길 수 있어요.",
    caution: "파이썬 list.pop(0)은 느려요. collections.deque를 쓰세요.",
    strength: "strong",
  },
  {
    id: "sig-both-ends",
    phrase: "앞과 뒤 양쪽에서 넣고 빼기",
    examples: ["앞이나 뒤에서 카드를 한 장씩 뽑을 수 있어요", "양 끝을 비교하며 줄여 나가요"],
    suspects: ["queue-deque"],
    patterns: ["two-ended-deque", "sliding-window-deque"],
    reason: "양쪽 끝을 모두 O(1)로 다룰 수 있는 자료구조가 덱이에요.",
    strength: "medium",
  },
  {
    id: "sig-self-similar",
    phrase: "큰 문제가 같은 모양의 작은 문제로 쪼개짐",
    examples: ["n번째 값은 n-1번째와 n-2번째 값으로 정해져요", "절반으로 나눠서 각각 해결한 뒤 합쳐요"],
    suspects: ["recursion"],
    patterns: ["recursive-definition", "divide-and-conquer"],
    reason: "문제 정의 안에 자기 자신이 다시 등장하면 재귀 함수로 그대로 옮길 수 있어요.",
    caution: "같은 계산이 반복되면 메모이제이션(DP)을 함께 떠올리세요.",
    strength: "medium",
  },
  {
    id: "sig-relations-given",
    phrase: "A와 B가 연결되어 있다는 관계 목록",
    examples: ["각 줄에 연결된 두 도시의 번호가 주어져요", "친구 관계 쌍이 주어져요"],
    suspects: ["graph-representation", "dfs", "bfs"],
    patterns: ["adjacency-list", "edge-list-conversion"],
    reason: "관계(간선) 목록이 주어지면 먼저 인접 리스트로 바꿔 두는 것이 거의 모든 그래프 문제의 첫 단계예요.",
    strength: "strong",
  },
  {
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
  },
  {
    id: "sig-grid-neighbors",
    phrase: "격자(지도) + 상하좌우 이동",
    examples: ["N×M 크기의 지도가 주어져요", "상하좌우로 인접한 칸으로만 이동할 수 있어요"],
    suspects: ["dfs", "bfs"],
    patterns: ["grid-flood-fill", "grid-shortest-path"],
    reason:
      "격자는 '칸 = 노드, 붙어 있는 칸 = 간선'인 그래프예요. 인접 리스트를 따로 만들지 않고 방향 배열 (-1,0), (1,0), (0,-1), (0,1)로 이웃을 구해요.",
    caution: "대각선 포함 여부(4방향 / 8방향)를 문제에서 반드시 확인하세요.",
    strength: "medium",
  },
  {
    id: "sig-path-exists",
    phrase: "갈 수 있는지 / 경로가 있는지 / 순환이 있는지",
    examples: ["출발점에서 도착점까지 갈 수 있나요?", "선수 과목 관계에 순환이 있는지 확인하세요"],
    suspects: ["dfs"],
    patterns: ["path-existence", "cycle-detection"],
    reason:
      "'있다/없다'만 알면 되니 한 길로 끝까지 가 보는 DFS가 간단해요. 재귀 호출 중인 노드를 다시 만나면 순환이에요.",
    strength: "medium",
  },
  {
    id: "sig-shortest-steps",
    phrase: "최단 거리 / 최소 횟수 / 가장 빨리",
    examples: ["도착점까지 최소 몇 칸을 지나야 하나요?", "최소 몇 번 만에 목표 상태가 되나요?"],
    suspects: ["bfs"],
    patterns: ["shortest-path-unweighted", "grid-shortest-path", "state-space-bfs"],
    reason: "BFS는 가까운 곳부터 한 겹씩 넓혀 가므로, 처음 도착한 순간의 거리가 곧 최단 거리예요.",
    caution: "간선마다 비용(가중치)이 다르면 BFS가 아니라 다익스트라예요.",
    strength: "strong",
  },
  {
    id: "sig-spread-simultaneous",
    phrase: "여러 곳에서 동시에 퍼짐 / 며칠 뒤에",
    examples: ["익은 토마토가 하루마다 옆 칸으로 퍼져요", "불이 1분마다 상하좌우로 번져요"],
    suspects: ["bfs"],
    patterns: ["multi-source-bfs", "level-order"],
    reason: "시작점을 전부 큐에 넣고 BFS를 한 번 돌리면, 퍼지는 시간이 곧 BFS의 층(거리)이에요.",
    strength: "strong",
  },
  {
    id: "sig-all-cases",
    phrase: "모든 경우의 수 / 가능한 조합을 전부",
    examples: ["가능한 모든 순서를 출력하세요", "합이 K가 되는 부분집합을 모두 찾으세요"],
    suspects: ["backtracking"],
    patterns: ["permutation", "combination", "subset"],
    reason: "하나씩 고르고, 끝까지 가면 기록하고, 되돌아와 다음 선택지를 고르는 흐름이 백트래킹이에요.",
    caution: "경우의 수가 너무 많다면 가지치기나 DP가 필요해요.",
    strength: "strong",
  },
  {
    id: "sig-small-n",
    phrase: "입력 크기가 아주 작음 (N ≤ 10 정도)",
    examples: ["1 ≤ N ≤ 8", "재료는 최대 10개예요"],
    suspects: ["backtracking"],
    patterns: ["constraint-pruning", "permutation"],
    reason: "N이 작으면 모든 경우를 다 만들어 봐도 시간 안에 끝나요. 완전 탐색을 허락한다는 힌트예요.",
    strength: "weak",
  },
];

const SIGNALS_BY_ID = new Map(SIGNALS.map((signal) => [signal.id, signal]));

export function getSignal(id: string): PatternSignal | undefined {
  return SIGNALS_BY_ID.get(id);
}
