import type { ConceptCard, RecognitionQuestion } from "@/types";

export const STACK_CARDS: ConceptCard[] = [
  {
    id: "stack-what",
    title: "스택은 접시 더미예요",
    analogy: "설거지한 접시를 쌓아 두면, 꺼낼 때는 맨 위 접시부터 꺼내죠.",
    body: [
      "스택(stack)은 **마지막에 넣은 것을 가장 먼저 꺼내는** 자료구조예요. 이 규칙을 **LIFO**(Last In, First Out)라고 불러요.",
      "",
      "넣고 빼는 곳이 **맨 위(top) 한 곳뿐**이라는 게 핵심이에요. 중간에 있는 접시를 바로 꺼낼 수는 없어요.",
    ].join("\n"),
    illustration: "stack-plates",
    keyPoints: [
      "마지막에 넣은 값이 먼저 나와요 (LIFO)",
      "넣고 빼는 곳은 top 하나뿐이에요",
      "중간 값은 바로 꺼내지 않아요",
    ],
  },
  {
    id: "stack-ops",
    title: "push · pop · peek",
    analogy: "접시 올리기, 맨 위 접시 꺼내기, 맨 위 접시 쳐다보기.",
    body: [
      "- **push(x)**: 맨 위에 x를 올려요.",
      "- **pop()**: 맨 위 값을 꺼내요. 꺼낸 값은 스택에서 사라져요.",
      "- **peek()**: 맨 위 값을 보기만 해요. 스택은 그대로예요.",
      "",
      "세 연산 모두 맨 위만 건드리므로 스택 크기와 상관없이 항상 빨라요(**O(1)**). Python은 리스트, JavaScript는 배열을 그대로 스택으로 쓸 수 있어요.",
    ].join("\n"),
    illustration: "stack-plates",
    keyPoints: ["push = 맨 위에 넣기", "pop = 맨 위에서 꺼내기", "peek = 맨 위 보기 (꺼내지 않음)", "모두 O(1)"],
    code: {
      code: {
        python: [
          "stack = []",
          "stack.append(3)     # push",
          "stack.append(5)",
          "top = stack[-1]     # peek → 5",
          "x = stack.pop()     # pop  → 5",
        ].join("\n"),
        javascript: [
          "const stack = [];",
          "stack.push(3);              // push",
          "stack.push(5);",
          "const top = stack.at(-1);   // peek → 5",
          "const x = stack.pop();      // pop  → 5",
        ].join("\n"),
      },
    },
  },
  {
    id: "stack-when",
    title: "언제 스택을 떠올릴까?",
    analogy: "되돌리기(Ctrl+Z)를 누르면 가장 최근에 한 작업부터 취소되죠.",
    body: [
      "문제가 **가장 최근 것**을 먼저 다뤄야 한다면 스택을 의심하세요.",
      "",
      "- **괄호·태그 짝 맞추기**: 닫는 괄호는 가장 최근에 연 괄호와 짝이에요.",
      "- **실행 취소 / 뒤로 가기**: 가장 최근 기록부터 되돌려요.",
      "- **직전 값과 비교하며 지우기**: 붙어 있는 같은 글자 지우기처럼, 방금 넣은 값과 비교해요.",
      "- **다음으로 큰 수**: 아직 답을 못 찾은 값들을 쌓아 두고 기다려요.",
    ].join("\n"),
    illustration: "stack-undo",
    keyPoints: ["'가장 최근' · '되돌리기' · '짝'이 보이면 스택", "먼저 온 순서대로 처리한다면 스택이 아니라 큐"],
  },
  {
    id: "stack-empty",
    title: "빈 스택을 조심해요",
    analogy: "빈 선반에서는 접시를 꺼낼 수 없어요.",
    body: [
      "비어 있는 스택에서 pop을 하면 Python은 **IndexError**가 나요. JavaScript는 오류 없이 **undefined**를 돌려주기 때문에 더 알아채기 어려워요.",
      "",
      "그래서 꺼내기 전에 **비어 있는지 먼저 확인**하는 습관을 들여요. 괄호 문제에서 닫는 괄호가 먼저 나오는 경우가 바로 이 상황이에요.",
    ].join("\n"),
    illustration: "stack-plates",
    keyPoints: ["pop 전에 비어 있는지 확인", "JS의 빈 배열 pop()은 조용히 undefined"],
    code: {
      code: {
        python: [
          "if stack:            # 비어 있지 않을 때만",
          "    x = stack.pop()",
          "else:",
          "    ...              # 비었을 때 처리",
        ].join("\n"),
        javascript: [
          "if (stack.length > 0) {   // 비어 있지 않을 때만",
          "  const x = stack.pop();",
          "} else {",
          "  // 비었을 때 처리",
          "}",
        ].join("\n"),
      },
    },
  },
];

export const STACK_QUIZ: RecognitionQuestion[] = [
  {
    id: "stack-q1",
    snippet:
      '문자열 s가 주어질 때, 모든 괄호가 올바르게 열리고 닫혔는지 판단하세요. 예를 들어 "(()())"는 올바르고 ")("는 올바르지 않아요.',
    choices: ["stack", "queue-deque", "bfs"],
    answer: "stack",
    signalIds: ["sig-bracket-pair"],
    highlightPhrases: ["올바르게 열리고 닫혔는지"],
    explanation: "닫는 괄호는 항상 가장 최근에 열린 괄호와 짝이 돼요. 가장 최근 것을 먼저 꺼내는 스택이 딱 맞아요.",
  },
  {
    id: "stack-q2",
    snippet: "메모장에 실행 취소 기능을 만들어요. 취소를 누르면 가장 최근에 한 작업부터 하나씩 되돌려요.",
    choices: ["queue-deque", "stack", "backtracking"],
    answer: "stack",
    signalIds: ["sig-latest-first"],
    highlightPhrases: ["가장 최근에 한 작업부터"],
    explanation: "나중에 한 작업이 먼저 취소되는 LIFO 흐름이에요. 작업을 스택에 쌓고 취소할 때 pop하면 돼요.",
  },
  {
    id: "stack-q3",
    snippet: "은행 창구에 도착한 순서대로 손님을 처리할 때, 각 손님의 업무가 끝나는 시각을 구하세요.",
    choices: ["stack", "queue-deque", "dfs"],
    answer: "queue-deque",
    signalIds: ["sig-arrival-order"],
    highlightPhrases: ["도착한 순서대로"],
    explanation: "먼저 온 손님이 먼저 나가요(FIFO). 스택이 아니라 큐의 신호예요. 스택과 헷갈리지 않는 게 중요해요!",
  },
  {
    id: "stack-q4",
    snippet:
      "문자열에서 같은 글자 두 개가 붙어 있으면 지워요. 지운 뒤 새로 붙게 된 글자끼리도 같으면 또 지워요. 마지막에 남는 문자열을 구하세요.",
    choices: ["stack", "bfs", "queue-deque"],
    answer: "stack",
    signalIds: ["sig-latest-first"],
    highlightPhrases: ["붙어 있으면 지워요", "새로 붙게 된"],
    explanation:
      "새 글자를 볼 때마다 '방금 남아 있는 글자(직전 값)'와 비교해요. 같으면 pop, 다르면 push — 스택으로 한 번에 풀려요.",
  },
  {
    id: "stack-q5",
    snippet: "미로의 출발점에서 도착점까지 가는 최소 이동 횟수를 구하세요.",
    choices: ["stack", "bfs", "backtracking"],
    answer: "bfs",
    signalIds: ["sig-shortest-steps"],
    highlightPhrases: ["최소 이동 횟수"],
    explanation:
      "'최소 횟수'는 BFS의 강한 신호예요. 뒤에서 배울 토픽이지만, 스택 문제가 아니라는 걸 알아보는 연습이에요.",
  },
];
