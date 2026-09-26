import { GENERATORS } from "@/lib/visualization/generators";
import type { JsonValue, TopicSlug, VisualizationGeneratorKey, VisualizationPreset } from "@/types";

function preset(
  id: string,
  generator: VisualizationGeneratorKey,
  title: string,
  description: string,
  input: JsonValue[],
): VisualizationPreset {
  return {
    id,
    title,
    description,
    generator,
    input,
    pseudocode: GENERATORS[generator].pseudocode,
    editableInput: true,
  };
}

/** 문제 풀이 화면의 시각화 프리셋 (예제 입력을 그대로 보여 주므로 입력은 고정) */
export function problemPreset(
  id: string,
  generator: VisualizationGeneratorKey,
  title: string,
  description: string,
  input: JsonValue[],
): VisualizationPreset {
  return { ...preset(id, generator, title, description, input), editableInput: false };
}

/** 같은 그래프를 DFS와 BFS로 비교해 볼 수 있게 두 토픽에서 함께 쓴다 */
const COMPARE_GRAPH: JsonValue[] = [
  6,
  [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
    [4, 5],
  ],
  0,
];

/** 토픽별 개념 학습 화면의 시각화 예시 */
export const TOPIC_VISUALIZATIONS: Record<TopicSlug, VisualizationPreset[]> = {
  stack: [
    preset(
      "stack-basic-intro",
      "stack-basic",
      "push · pop · peek",
      "접시를 올리고 꺼내듯 값이 맨 위에서만 들어가고 나와요. 마지막 pop에서 무슨 일이 생기는지도 보세요.",
      [["push 3", "push 5", "push 7", "peek", "pop", "pop", "push 2", "pop", "pop", "pop"]],
    ),
    preset(
      "stack-bracket-ok",
      "stack-bracket",
      "괄호 짝 맞추기",
      "닫는 괄호는 항상 가장 최근에 연 괄호와 짝이 돼요. 그래서 스택이 딱 맞아요.",
      ["({[]})"],
    ),
    preset(
      "stack-bracket-bad",
      "stack-bracket",
      "짝이 엇갈린 괄호",
      "괄호 개수는 맞지만 순서가 엇갈리면 틀린 문자열이에요. 스택이 어디서 알아채는지 보세요.",
      ["([)]"],
    ),
  ],
  "queue-deque": [
    preset("queue-basic-intro", "queue-basic", "줄 서기 (큐)", "먼저 온 값이 먼저 나가요. 스택과 비교해 보세요.", [
      ["enqueue 1", "enqueue 2", "enqueue 3", "dequeue", "enqueue 4", "peek", "dequeue", "dequeue"],
    ]),
    preset(
      "deque-basic-intro",
      "deque-basic",
      "양쪽에서 넣고 빼기 (덱)",
      "덱은 앞과 뒤 어느 쪽에서든 넣고 뺄 수 있어요.",
      [["push_back 1", "push_back 2", "push_front 0", "pop_back", "push_front 9", "pop_front", "pop_front"]],
    ),
  ],
  recursion: [
    preset(
      "factorial-4",
      "recursion-factorial",
      "팩토리얼과 호출 스택",
      "factorial(4)가 factorial(1)까지 내려갔다가 값을 곱하며 돌아오는 모습을 봐요.",
      [4],
    ),
    preset(
      "fibonacci-4",
      "recursion-fibonacci",
      "피보나치 재귀 트리",
      "fib(n)은 두 번씩 자기 자신을 불러요. 같은 계산이 몇 번이나 반복되는지 세어 보세요.",
      [4],
    ),
  ],
  "graph-representation": [
    preset(
      "adjacency-intro",
      "graph-adjacency",
      "간선 목록 → 인접 리스트",
      "연결 관계 목록을 노드별 이웃 리스트로 바꿔요. 무방향이면 양쪽에 모두 적어야 해요.",
      [
        5,
        [
          [0, 1],
          [0, 2],
          [1, 3],
          [2, 3],
          [3, 4],
        ],
      ],
    ),
  ],
  dfs: [
    preset(
      "graph-dfs-intro",
      "graph-dfs",
      "그래프 DFS",
      "한 이웃으로 끝까지 들어갔다가 막히면 돌아와요. 호출 스택과 방문 순서를 함께 보세요.",
      COMPARE_GRAPH,
    ),
    preset(
      "grid-dfs-mini",
      "grid-dfs",
      "격자에서 구역 세기",
      "격자도 그래프예요. 꽃이 있는 칸을 DFS로 칠하면 이어진 구역 하나가 끝나요.",
      [["110", "010", "001"]],
    ),
  ],
  bfs: [
    preset(
      "graph-bfs-intro",
      "graph-bfs",
      "그래프 BFS",
      "DFS와 같은 그래프예요. 가까운 노드부터 한 겹씩 퍼져 나가고, 처음 발견한 순간의 거리가 최단 거리예요.",
      COMPARE_GRAPH,
    ),
    preset(
      "grid-bfs-maze",
      "grid-bfs",
      "미로 최단 거리",
      "출발점에서 물결처럼 퍼져 나가다가 도착점에 처음 닿으면 그게 가장 짧은 길이에요.",
      [["S.#..", "..#.#", "#...#", ".#.#.", "...E."]],
    ),
  ],
  backtracking: [
    preset(
      "permutation-3",
      "backtracking-permutation",
      "순열 만들기",
      "고르고, 더 들어가고, 되돌리기. path가 스택처럼 쌓였다 빠지는 모습을 보세요.",
      [[1, 2, 3]],
    ),
    preset(
      "subset-3",
      "backtracking-subset",
      "부분집합 결정 트리",
      "원소마다 넣을지 말지 두 갈래로 나뉘어요. 트리의 잎 하나가 부분집합 하나예요.",
      [[1, 2, 3]],
    ),
  ],
  hash: [
    preset(
      "hash-buckets-intro",
      "hash-buckets",
      "해시 테이블과 충돌",
      "키마다 해시 함수로 칸 번호를 정해요. cat과 act는 글자가 같아 같은 칸에 들어가요(충돌). 찾을 때는 그 한 칸만 봐요.",
      [["add cat", "add dog", "add act", "find act", "find cow"], 5],
    ),
    preset(
      "hash-count-fruits",
      "hash-count",
      "개수 세기",
      "한 번 훑으면서 count[x] += 1. 처음 보는 키는 1부터 시작해요.",
      [["apple", "kiwi", "apple", "plum", "kiwi", "apple"]],
    ),
    preset(
      "hash-two-sum-7",
      "hash-two-sum",
      "두 수의 합 짝 찾기",
      "지금 수의 짝(target - x)이 이미 지나온 수 중에 있는지 seen에 물어봐요. 모든 쌍을 비교하지 않아요.",
      [[4, 9, 1, 6, 3], 7],
    ),
  ],
  sorting: [
    preset(
      "sort-insertion-6",
      "sort-insertion",
      "삽입 정렬",
      "카드를 한 장씩 뽑아, 왼쪽의 정렬된 카드들 사이 알맞은 자리에 끼워 넣어요. 큰 카드는 한 칸씩 오른쪽으로 밀려요.",
      [[5, 2, 4, 6, 1, 3]],
    ),
    preset(
      "sort-merge-7",
      "sort-merge",
      "병합 정렬",
      "한 칸이 될 때까지 반으로 나눈 뒤, 정렬된 두 줄의 맨 앞끼리 비교하며 합쳐요.",
      [[38, 27, 43, 3, 9, 82, 10]],
    ),
    preset(
      "sort-counting-10",
      "sort-counting",
      "계수 정렬",
      "값이 0~9뿐이면 비교하지 않고, 값마다 개수를 센 다음 작은 값부터 개수만큼 늘어놓아요.",
      [[3, 1, 4, 1, 5, 9, 2, 6, 5, 3]],
    ),
  ],
  "binary-search": [
    preset(
      "bsearch-exact-11",
      "bsearch-exact",
      "정확히 찾기",
      "가운데를 보고, 찾는 값보다 작으면 왼쪽 절반을, 크면 오른쪽 절반을 통째로 버려요. 11칸이 4번 만에 끝나요.",
      [[3, 8, 15, 21, 27, 34, 42, 56, 63, 77, 88], 42],
    ),
    preset(
      "bsearch-lower-bound-4",
      "bsearch-lower-bound",
      "경계 찾기 (lower bound)",
      "같은 값이 여러 개일 때 '처음으로 target 이상이 되는 자리'를 찾아요. mid가 조건을 만족해도 버리지 않고 남겨 둬요.",
      [[2, 4, 4, 4, 7, 9, 12], 4],
    ),
    preset(
      "bsearch-answer-cables",
      "bsearch-answer",
      "답을 이분 탐색 (줄 자르기)",
      "배열이 아니라 '답'의 범위를 반씩 줄여요. 길이 X로 가능한지 확인해서 되면 더 길게, 안 되면 더 짧게.",
      [[80, 43, 57, 39], 11],
    ),
  ],
  dp: [
    preset(
      "dp-stairs-6",
      "dp-stairs",
      "계단 오르기 (1차원 표)",
      "i칸까지 오는 방법 = (i-1칸까지) + (i-2칸까지). 앞에서 적어 둔 답을 꺼내 쓰니 같은 계산을 다시 하지 않아요.",
      [6],
    ),
    preset(
      "dp-grid-paths-3x4",
      "dp-grid-paths",
      "격자 길 세기 (2차원 표)",
      "오른쪽·아래로만 가면, 한 칸으로 오는 길 = 위 칸의 길 + 왼쪽 칸의 길이에요. 막힌 칸은 0이에요.",
      [["....", ".#..", "...."]],
    ),
    preset(
      "dp-lcs-words",
      "dp-lcs",
      "가장 긴 공통 부분 수열 (두 문자열 표)",
      "글자가 같으면 대각선 + 1, 다르면 위·왼쪽 중 큰 값. 표가 다 차면 오른쪽 아래 칸이 답이에요.",
      ["acbde", "abcfe"],
    ),
  ],
  greedy: [
    preset(
      "greedy-meetings-8",
      "greedy-intervals",
      "회의 고르기 (끝나는 시각 순)",
      "끝나는 시각이 빠른 회의부터 보고, 앞 회의와 겹치지 않으면 골라요. 일찍 끝날수록 남는 시간이 많아요.",
      [
        [
          [1, 4],
          [3, 5],
          [0, 6],
          [5, 7],
          [3, 9],
          [5, 9],
          [6, 10],
          [8, 11],
        ],
      ],
    ),
    preset(
      "greedy-coins-1260",
      "greedy-coins",
      "거스름돈 (큰 동전부터)",
      "큰 동전부터 쓸 수 있는 만큼 써요. 동전끼리 배수 관계라서 이 방법이 항상 최선이에요. [4, 3, 1]로 6원을 만들어 보면 반례가 보여요.",
      [[500, 100, 50, 10], 1260],
    ),
    preset(
      "greedy-digits-4",
      "greedy-digits",
      "큰 수 만들기 (앞자리부터 크게)",
      "앞자리가 클수록 큰 수예요. 뒤에 더 큰 숫자가 오면, 앞의 작은 숫자를 지울 기회를 써요.",
      ["4177252841", 4],
    ),
  ],
  "two-pointers": [
    preset(
      "tp-pair-sum-20",
      "tp-pair-sum",
      "양 끝에서 좁히기 (합이 target인 두 수)",
      "정렬돼 있으니 합이 작으면 왼쪽을, 크면 오른쪽을 한 칸 옮겨요. 모든 쌍을 볼 필요가 없어요.",
      [[1, 2, 4, 6, 9, 11, 14, 17], 20],
    ),
    preset(
      "tp-min-window-7",
      "tp-min-window",
      "늘였다 줄이는 창 (합이 S 이상인 가장 짧은 구간)",
      "오른쪽을 늘려 조건을 채우고, 채워지면 왼쪽을 줄여 더 짧게 만들어 봐요. 칸마다 한 번 들어가고 한 번 나가요.",
      [[2, 3, 1, 2, 4, 3], 7],
    ),
    preset(
      "tp-dedupe-9",
      "tp-dedupe",
      "같은 방향 두 포인터 (중복 없애기)",
      "읽는 손가락은 계속 앞으로, 쓰는 손가락은 새 값이 나올 때만 앞으로. 새 배열 없이 제자리에서 걸러요.",
      [[1, 1, 2, 3, 3, 3, 5, 8, 8]],
    ),
  ],
  heap: [
    preset(
      "heap-ops-7",
      "heap-ops",
      "넣기와 꺼내기",
      "넣은 값은 맨 끝에서 부모보다 작으면 위로 올라가요. 꺼낼 땐 맨 위를 빼고, 맨 끝 값을 올려 아래로 내려 보내요.",
      [["push 5", "push 3", "push 8", "push 1", "push 4", "pop", "pop"]],
    ),
    preset(
      "heap-merge-5",
      "heap-merge",
      "가장 작은 두 더미 합치기",
      "가장 작은 두 개를 꺼내 합치고 다시 넣기를 반복해요. 매번 정렬하지 않아도 힙이 가장 작은 것을 알려 줘요.",
      [[10, 20, 40, 5, 15]],
    ),
    preset(
      "heap-top-k-3",
      "heap-top-k",
      "상위 3개만 남기기",
      "크기 3인 최소 힙을 두면 맨 위가 늘 3번째로 큰 수예요. 그보다 작은 수는 들어올 필요가 없어요.",
      [[5, 1, 9, 3, 7, 2, 8], 3],
    ),
  ],
};
