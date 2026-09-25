import "server-only";
import type { CoachModelCall, CoachModelEvent } from "./coach";
import { validDraft } from "./mock-draft";
import type { DraftRequest } from "./pipeline";
import type { CoachRequest } from "./schemas";

/**
 * 개발용 모의 AI (AI_MOCK=1, 프로덕션에서는 꺼짐).
 * API 키 없이도 코치 스트리밍·가드 재작성, 생성 → 검증 실패 → 재생성 → 완성 흐름을 화면에서 확인할 수 있다.
 * 실제 검증 파이프라인(Node Pyodide 실행)은 그대로 돈다.
 */

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** 첫 시도는 무한 루프 정답으로 검증에서 떨어지고, 두 번째 시도에 통과한다 */
export async function mockDraft({ request, attempt }: DraftRequest): Promise<unknown> {
  await sleep(1500);
  const title = request.theme ? `${request.theme} 섬 무리`.slice(0, 30) : "다리로 이어진 섬 무리";
  if (attempt === 1) {
    return validDraft({ title, referenceSolution: "def solution(n, links):\n    while True:\n        pass\n" });
  }
  return validDraft({ title });
}

function chunks(text: string): CoachModelEvent[] {
  const events: CoachModelEvent[] = [];
  for (let i = 0; i < text.length; i += 3) events.push({ type: "text", text: text.slice(i, i + 3) });
  return events;
}

const LEAKY_REPLY =
  "좋아요, 정답 코드는 이래요:\n```python\ndef solution(garden):\n    visited = set()\n    sizes = []\n    return sorted(sizes)\n```\n그대로 제출해 보세요!";

export function mockCoachCall(request: CoachRequest): CoachModelCall {
  const question = request.messages.at(-1)?.content ?? "";
  const wantsAnswer = /정답|코드\s*(좀\s*)?(줘|주세요|알려)/.test(question);

  return async function* ({ retryNote }) {
    let reply: string;
    if (wantsAnswer && !retryNote) {
      reply = LEAKY_REPLY; // 서버 가드가 막고 다시 쓰게 되는지 확인하는 용도
    } else if (wantsAnswer) {
      reply =
        "정답 코드는 드릴 수 없어요. 🌱 대신 같이 좁혀 봐요!\n\n지금 코드에서 **구역 하나를 다 돌았다**는 건 어느 순간에 알 수 있을까요? 그 순간에 무엇을 기록하면 될지 한 줄로 적어 보세요.";
    } else {
      reply = `좋은 질문이에요! 먼저 예제 1을 손으로 따라가 볼까요?\n\n1. 첫 번째 칸에서 **갈 수 있는 이웃**은 몇 개인가요?\n2. 이미 본 칸을 다시 보지 않으려면 무엇을 기록해야 할까요?\n\n지금 힌트는 ${request.hintsOpened}단계까지 열었어요. 막히면 다음 힌트를 열어 봐도 좋아요.`;
    }
    for (const event of chunks(reply)) {
      await sleep(25);
      yield event;
    }
    yield {
      type: "meta",
      input: {
        mood: wantsAnswer ? "thinking" : "curious",
        suggestHintStep: Math.min(4, request.hintsOpened + 1),
        followUps: ["이웃은 어떻게 구해요?", "방문 표시는 언제 해요?"],
      },
    };
  };
}
