// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AreaChart, smoothPath } from "@/components/admin/area-chart";
import { dayLabel, describeChange, relativeTime } from "@/components/admin/format";

afterEach(cleanup);

describe("지난주 대비 변화", () => {
  it("지난주가 10 이상이면 %, 작으면 개수 차이로 보여 준다 (작은 수의 %는 과장된다)", () => {
    expect(describeChange(640, 571, "건")).toMatchObject({ direction: "up", short: "+12%" });
    expect(describeChange(120, 131, "개")).toMatchObject({ direction: "down", short: "−8%" });
    expect(describeChange(3, 1, "명")).toMatchObject({ direction: "up", short: "+2" });
    expect(describeChange(88, 0, "번")).toMatchObject({ direction: "up", short: "+88" });
    expect(describeChange(6, 6, "개")).toMatchObject({ direction: "flat", short: "±0" });
    expect(describeChange(0, 0, "개").description).toContain("지난주와 같아요");
    expect(describeChange(14, 9, "명").description).toBe("지난주 9명 → 이번 주 14명");
  });

  it("날짜와 상대 시간", () => {
    expect(dayLabel("2026-09-26")).toBe("9월 26일 (토)");
    const now = Date.parse("2026-09-26T12:00:00+09:00");
    expect(relativeTime("2026-09-26T11:59:40+09:00", now)).toBe("방금 전");
    expect(relativeTime("2026-09-26T11:40:00+09:00", now)).toBe("20분 전");
    expect(relativeTime("2026-09-26T09:00:00+09:00", now)).toBe("3시간 전");
    expect(relativeTime("2026-09-24T12:00:00+09:00", now)).toBe("2일 전");
  });
});

describe("부드러운 곡선", () => {
  it("오르내림이 바뀌는 점에서 기울기 0이라 값 범위를 벗어나지 않는다", () => {
    const d = smoothPath([
      { x: 0, y: 100 },
      { x: 10, y: 0 },
      { x: 20, y: 100 },
    ]);
    const ys = [...d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)].map((m) => Number(m[2]));
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...ys)).toBeLessThanOrEqual(100);
  });

  it("점이 하나거나 없어도 그린다", () => {
    expect(smoothPath([])).toBe("");
    expect(smoothPath([{ x: 5, y: 5 }])).toBe("M5,5");
  });
});

describe("추이 차트", () => {
  const points = [
    { day: "2026-09-24", value: 3 },
    { day: "2026-09-25", value: 0 },
    { day: "2026-09-26", value: 7 },
  ];

  it("합계·하루 평균을 설명과 함께 보여 준다", () => {
    const { rerender } = render(<AreaChart title="가입" unit="명" tone="violet" points={points} />);
    expect(screen.getByText(/3일 합계/)).toBeTruthy();
    rerender(<AreaChart title="활동 회원" unit="명" tone="mint" points={points} summary="average" />);
    expect(screen.getByText(/하루 평균/)).toBeTruthy();
    expect(screen.getByText("3.3", { exact: false })).toBeTruthy();
  });

  it("키보드로 날짜를 옮기면 툴팁에 그날 값이 나온다", () => {
    render(<AreaChart title="가입" unit="명" tone="violet" points={points} />);
    const plot = screen.getByRole("group", { name: /가입 최근 3일 추이/ });
    fireEvent.focus(plot);
    expect(screen.getByRole("status").textContent).toContain("9월 26일 (토)");
    fireEvent.keyDown(plot, { key: "ArrowLeft" });
    expect(screen.getByRole("status").textContent).toContain("9월 25일 (금)");
    fireEvent.keyDown(plot, { key: "Home" });
    expect(screen.getByRole("status").textContent).toContain("3명");
  });

  it("표는 기본으로 접혀 있고, 누르면 펼쳐진다", () => {
    render(<AreaChart title="가입" unit="명" tone="violet" points={points} />);
    const toggle = screen.getByRole("button", { name: /표로 보기/ });
    const wrap = document.getElementById(toggle.getAttribute("aria-controls") ?? "");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(wrap?.hasAttribute("inert")).toBe(true);
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(wrap?.hasAttribute("inert")).toBe(false);
  });
});
