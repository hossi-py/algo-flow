// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MASCOT_MOODS, MOOD_LABELS } from "@/components/mascot/moods";
import { Nodi } from "@/components/mascot/nodi";

afterEach(cleanup);

describe("Nodi", () => {
  it.each(MASCOT_MOODS)("%s 표정이 스크린 리더 설명과 함께 그려진다", (mood) => {
    render(<Nodi mood={mood} />);
    expect(screen.getByRole("img", { name: MOOD_LABELS[mood] })).toBeTruthy();
  });

  it("성장 단계와 꽃이 있어도 그려진다", () => {
    const { container } = render(
      <Nodi mood="cheer" growth="bloom" flowers={["peach", "mint", "lilac", "sky", "blossom", "lemon", "sage"]} />,
    );
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("장식용이면 스크린 리더에서 숨긴다", () => {
    const { container } = render(<Nodi decorative />);
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.queryByRole("img")).toBeNull();
  });
});
