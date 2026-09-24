import type { ConceptCard, RecognitionQuestion } from "@/types";

export const RECURSION_CARDS: ConceptCard[] = [
  {
    id: "recursion-what",
    title: "자기 자신을 부르는 함수",
    analogy: "마주 보는 두 거울 사이에 서면, 거울 속에 거울이, 그 안에 또 거울이 보여요.",
    body: [
      "재귀(recursion)는 함수가 **자기 자신을 다시 부르는** 방법이에요.",
      "",
      "큰 문제 안에 **모양이 같은 작은 문제**가 들어 있을 때 써요. 예를 들어 `n!`은 `n × (n-1)!`이고, `(n-1)!`도 같은 방법으로 구할 수 있어요.",
    ].join("\n"),
    illustration: "recursion-mirror",
    keyPoints: ["함수 안에서 같은 함수를 다시 불러요", "큰 문제를 같은 모양의 작은 문제로 줄여요"],
  },
  {
    id: "recursion-two-parts",
    title: "종료 조건 + 한 단계 작은 호출",
    analogy: "마트료시카 인형을 열다 보면, 더 열리지 않는 가장 작은 인형에서 멈춰요.",
    body: [
      "재귀 함수는 언제나 두 부분으로 만들어요.",
      "",
      "1. **종료 조건**: 더 쪼갤 수 없는 가장 작은 경우의 답을 바로 반환해요.",
      "2. **재귀 호출**: 한 단계 **작은** 문제를 불러 그 답으로 지금 답을 만들어요.",
      "",
      "재귀 호출은 반드시 종료 조건 쪽으로 다가가야 해요. 그렇지 않으면 끝없이 불러요.",
    ].join("\n"),
    illustration: "recursion-dolls",
    keyPoints: [
      "종료 조건을 먼저 적어요",
      "재귀 호출은 문제를 더 작게 만들어야 해요",
      "둘 중 하나라도 빠지면 무한 호출",
    ],
    code: {
      code: {
        python: [
          "def factorial(n):",
          "    if n == 1:                    # 종료 조건",
          "        return 1",
          "    return n * factorial(n - 1)   # 한 단계 작은 호출",
        ].join("\n"),
        javascript: [
          "function factorial(n) {",
          "  if (n === 1) return 1;           // 종료 조건",
          "  return n * factorial(n - 1);     // 한 단계 작은 호출",
          "}",
        ].join("\n"),
        java: [
          "int factorial(int n) {",
          "    if (n == 1) return 1;            // 종료 조건",
          "    return n * factorial(n - 1);     // 한 단계 작은 호출",
          "}",
        ].join("\n"),
      },
    },
  },
  {
    id: "recursion-call-stack",
    title: "호출 스택이 쌓였다 풀려요",
    analogy:
      "심부름을 부탁받은 사람이 또 다른 사람에게 부탁하고, 마지막 사람이 답을 주면 거꾸로 차례차례 답이 돌아와요.",
    body: [
      "함수를 부르면 **호출 스택**에 그 호출이 쌓여요. 재귀가 깊어질수록 스택이 높아지고, 종료 조건에서 답이 나오면 **가장 최근 호출부터** 차례로 끝나며 내려와요.",
      "",
      "Python은 기본으로 재귀를 약 1,000번까지만 허용해요. 더 깊으면 **RecursionError**가 나요. 이 앱의 채점기는 3,000번까지 허용해요. 브라우저에서 도는 Java는 약 2,000단계까지 안전해요.",
    ].join("\n"),
    illustration: "recursion-mirror",
    keyPoints: ["부를 때마다 호출 스택에 쌓여요", "가장 최근 호출부터 끝나요 (스택!)", "너무 깊으면 RecursionError"],
  },
  {
    id: "recursion-memo",
    title: "같은 계산은 메모해 두기",
    analogy: "한 번 푼 수학 문제의 답을 공책에 적어 두면, 같은 문제가 또 나와도 다시 풀 필요가 없어요.",
    body: [
      "`fib(n) = fib(n-1) + fib(n-2)`를 그대로 재귀로 짜면 **같은 값을 여러 번** 계산해요. 호출을 나무처럼 그려 보면 `fib(2)`가 셀 수 없이 나와요. n이 40만 돼도 호출이 수억 번이에요.",
      "",
      "한 번 계산한 답을 딕셔너리(Map)에 저장해 두고 다시 쓰는 것을 **메모이제이션**이라고 해요. 각 값을 한 번씩만 계산하니 호출이 n번 정도로 줄어요.",
    ].join("\n"),
    illustration: "recursion-dolls",
    keyPoints: ["호출 트리를 그려 중복 계산을 찾아요", "계산한 답은 memo에 저장", "메모가 있으면 각 값은 한 번만 계산"],
    code: {
      code: {
        python: [
          "memo = {}",
          "def fib(n):",
          "    if n <= 2:",
          "        return 1",
          "    if n not in memo:",
          "        memo[n] = fib(n - 1) + fib(n - 2)",
          "    return memo[n]",
        ].join("\n"),
        javascript: [
          "const memo = new Map();",
          "function fib(n) {",
          "  if (n <= 2) return 1;",
          "  if (!memo.has(n)) memo.set(n, fib(n - 1) + fib(n - 2));",
          "  return memo.get(n);",
          "}",
        ].join("\n"),
        java: [
          "Map<Integer, Long> memo = new HashMap<>();",
          "long fib(int n) {",
          "    if (n <= 2) return 1;",
          "    if (!memo.containsKey(n)) memo.put(n, fib(n - 1) + fib(n - 2));",
          "    return memo.get(n);",
          "}",
        ].join("\n"),
      },
    },
  },
  {
    id: "recursion-when",
    title: "언제 재귀를 떠올릴까?",
    analogy: "폴더 안에 폴더가 있고, 그 안에 또 폴더가 있는 컴퓨터 파일 정리.",
    body: [
      "- **식 안에 자기 자신이 있다**: `f(n) = f(n-1) + f(n-2)` 같은 점화식",
      "- **한 단계 작은 같은 문제로 줄일 수 있다**: n층 하노이 탑 = n−1층 옮기기 두 번 + 1번",
      "- **안에 같은 모양이 또 들어 있다**: 4등분한 조각을 또 4등분, 폴더 안의 폴더",
      "- **절반으로 나눠 각각 풀고 합친다**: 분할 정복",
      "",
      "뒤에서 배울 **DFS**와 **백트래킹**도 재귀로 가장 자연스럽게 짜요.",
    ].join("\n"),
    illustration: "recursion-mirror",
    keyPoints: ["점화식 → 재귀", "같은 모양이 중첩 → 재귀", "같은 계산이 반복되면 메모"],
  },
];

export const RECURSION_QUIZ: RecognitionQuestion[] = [
  {
    id: "recursion-q1",
    snippet:
      "첫째 날과 둘째 날에는 새싹이 1개씩 나요. 셋째 날부터는 전날과 그 전날에 난 새싹 수를 더한 만큼 나요. n번째 날에 나는 새싹 수를 구하세요.",
    choices: ["recursion", "queue-deque", "bfs"],
    answer: "recursion",
    signalIds: ["sig-self-similar"],
    highlightPhrases: ["전날과 그 전날에 난 새싹 수를 더한 만큼"],
    explanation: "답이 앞선 답들로 정의되는 점화식이에요. 재귀로 그대로 옮기되, 중복 계산은 메모로 줄여요.",
  },
  {
    id: "recursion-q2",
    snippet: "폴더 안에는 파일과 또 다른 폴더가 들어 있어요. 가장 바깥 폴더 안에 있는 모든 파일의 크기 합을 구하세요.",
    choices: ["stack", "recursion", "queue-deque"],
    answer: "recursion",
    signalIds: ["sig-nested-structure"],
    highlightPhrases: ["또 다른 폴더가 들어 있어요"],
    explanation:
      "폴더 안에 같은 모양(폴더)이 중첩돼 있어요. '폴더 크기 = 파일 크기 합 + 하위 폴더 크기들'로 재귀가 자연스러워요.",
  },
  {
    id: "recursion-q3",
    snippet: "배열을 절반으로 나눠 각각 정렬한 뒤, 정렬된 두 절반을 합쳐 전체를 정렬하세요.",
    choices: ["recursion", "backtracking", "stack"],
    answer: "recursion",
    signalIds: ["sig-self-similar"],
    highlightPhrases: ["절반으로 나눠 각각 정렬한 뒤"],
    explanation: "나누고, 각각 같은 방법으로 풀고, 합치는 분할 정복이에요. 병합 정렬이 대표 예예요.",
  },
  {
    id: "recursion-q4",
    snippet: "놀이기구 앞에 선 순서대로 한 명씩 태워요. 각 사람이 탑승하는 시각을 구하세요.",
    choices: ["recursion", "queue-deque", "dfs"],
    answer: "queue-deque",
    signalIds: ["sig-arrival-order"],
    highlightPhrases: ["선 순서대로"],
    explanation: "먼저 온 사람이 먼저 타는 FIFO예요. 자기 자신을 다시 부를 구조가 없으니 재귀가 아니라 큐예요.",
  },
  {
    id: "recursion-q5",
    snippet:
      "원판 n개를 세 기둥을 이용해 옮기려고 해요. 위의 n−1개를 옆 기둥으로 옮긴 뒤 가장 큰 원판을 옮기면 돼요. 최소 이동 횟수를 구하세요.",
    choices: ["bfs", "stack", "recursion"],
    answer: "recursion",
    signalIds: ["sig-shrink-by-one"],
    highlightPhrases: ["위의 n−1개를 옆 기둥으로 옮긴 뒤"],
    explanation: "n개 문제가 n−1개 문제 두 번으로 줄어요. 한 단계 작은 같은 문제로 줄이는 전형적인 재귀예요.",
  },
];
