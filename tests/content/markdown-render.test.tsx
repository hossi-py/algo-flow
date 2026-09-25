// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Markdown } from "@/components/common/markdown";
import { PROBLEMS } from "@/content/problems";
import { TOPICS } from "@/content/topics";

afterEach(cleanup);

/**
 * CommonMark는 `**재귀(호출 스택)**나`처럼 닫는 ** 앞이 문장부호이고 뒤가 글자(조사)면
 * 굵게로 인정하지 않고 별표를 그대로 보여 준다. 한국어 콘텐츠에서 자주 생기므로 렌더 결과로 검사한다.
 */
const TEXTS: [string, string][] = [
  ...TOPICS.flatMap((topic) =>
    topic.concept.cards.map((card) => [`${topic.slug}/${card.id}`, card.body] as [string, string]),
  ),
  ...PROBLEMS.flatMap((problem) => [
    [`${problem.slug}/statement`, problem.statement] as [string, string],
    [`${problem.slug}/inputFormat`, problem.inputFormat] as [string, string],
    [`${problem.slug}/outputFormat`, problem.outputFormat] as [string, string],
    ...problem.hints.map((hint) => [`${problem.slug}/hint${hint.step}`, hint.body] as [string, string]),
  ]),
];

describe("마크다운 콘텐츠", () => {
  it.each(TEXTS)("%s: 굵게·기울임 표시가 모두 렌더링된다", (_, text) => {
    const { container } = render(<Markdown>{text}</Markdown>);
    const rendered = container.textContent ?? "";
    expect(rendered).not.toContain("**");
    expect(rendered).not.toMatch(/(^|[^_])__[^_]/);
  });
});
