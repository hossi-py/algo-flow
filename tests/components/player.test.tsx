// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Player } from "@/components/visualizer/player";
import { GENERATORS, runGenerator } from "@/lib/visualization/generators";
import { BASE_STEP_MS } from "@/lib/visualization/player";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const result = runGenerator("stack-basic", [["push 3", "push 5", "peek", "pop"]]);
if (!result.ok) throw new Error(result.error);
const steps = result.steps;
const pseudocode = GENERATORS["stack-basic"].pseudocode;

function setup() {
  render(<Player steps={steps} pseudocode={pseudocode} resetKey="test" />);
  return screen.getByRole("region", { name: /한 단계씩 보기/ });
}

/** 의사코드에서 강조된 줄 번호 (1부터) */
function highlightedLine(): number | null {
  const items = [...document.querySelectorAll("ol li")].filter((li) =>
    li.closest("section")?.textContent?.startsWith("의사코드"),
  );
  const index = items.findIndex((li) => li.getAttribute("aria-current") === "step");
  return index === -1 ? null : index + 1;
}

describe("Player", () => {
  it("첫 스텝의 문구·카운터·의사코드 줄을 보여 준다", () => {
    setup();
    expect(screen.getByText(steps[0]!.message)).toBeTruthy();
    expect(screen.getByText(`1 / ${steps.length}`)).toBeTruthy();
    expect(highlightedLine()).toBe(steps[0]!.codeLine);
  });

  it("→ / ← 키로 한 스텝씩 이동하고 의사코드 강조가 따라온다", () => {
    const region = setup();
    fireEvent.keyDown(region, { key: "ArrowRight" });
    fireEvent.keyDown(region, { key: "ArrowRight" });
    expect(screen.getByText(steps[2]!.message)).toBeTruthy();
    expect(highlightedLine()).toBe(steps[2]!.codeLine);
    fireEvent.keyDown(region, { key: "ArrowLeft" });
    expect(screen.getByText(steps[1]!.message)).toBeTruthy();
    expect(highlightedLine()).toBe(steps[1]!.codeLine);
  });

  it("Space로 재생·일시정지하고, 재생 중에는 속도에 맞춰 자동으로 넘어간다", () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const region = setup();
    fireEvent.keyDown(region, { key: " " });
    expect(screen.getByRole("button", { name: "일시정지" })).toBeTruthy();
    act(() => {
      vi.advanceTimersByTime(BASE_STEP_MS);
    });
    expect(screen.getByText(`2 / ${steps.length}`)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "2x" }));
    act(() => {
      vi.advanceTimersByTime(BASE_STEP_MS / 2);
    });
    expect(screen.getByText(`3 / ${steps.length}`)).toBeTruthy();

    fireEvent.keyDown(region, { key: " " });
    expect(screen.getByRole("button", { name: "재생" })).toBeTruthy();
    act(() => {
      vi.advanceTimersByTime(BASE_STEP_MS * 3);
    });
    expect(screen.getByText(`3 / ${steps.length}`)).toBeTruthy();
  });

  it("버튼과 스크럽 슬라이더로 이동한다", () => {
    setup();
    expect((screen.getByRole("button", { name: "처음으로" }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "마지막으로" }));
    expect(screen.getByText(steps.at(-1)!.message)).toBeTruthy();
    expect((screen.getByRole("button", { name: "다음 단계" }) as HTMLButtonElement).disabled).toBe(true);

    fireEvent.change(screen.getByRole("slider", { name: "단계 이동" }), { target: { value: "1" } });
    expect(screen.getByText(steps[1]!.message)).toBeTruthy();
  });

  it("입력 칸에서 누른 키는 가로채지 않는다", () => {
    render(
      <div>
        <Player steps={steps} pseudocode={pseudocode} resetKey="test" />
      </div>,
    );
    const region = screen.getByRole("region", { name: /한 단계씩 보기/ });
    const input = document.createElement("textarea");
    region.appendChild(input);
    fireEvent.keyDown(input, { key: "ArrowRight" });
    expect(screen.getByText(`1 / ${steps.length}`)).toBeTruthy();
  });
});
