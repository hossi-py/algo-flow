// @vitest-environment jsdom
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const location = vi.hoisted(() => ({ pathname: "/", search: "" }));
vi.mock("next/navigation", () => ({
  usePathname: () => location.pathname,
  useSearchParams: () => new URLSearchParams(location.search),
}));

import { NavigationProgress } from "@/components/layout/navigation-progress";

/** 링크 클릭은 document에서 가로채므로 일반 <a>로 충분하다 (next/link 없이) */
const HOME = "/";
const page = () => (
  <>
    <NavigationProgress />
    <a href="/ranking">랭킹</a>
    <a href={HOME}>홈</a>
    <a href="https://example.com/">바깥</a>
  </>
);

function setup() {
  const view = render(page());
  const link = (name: string) => view.getByText(name);
  const bar = () => view.container.querySelector(".nav-progress");
  /** 링크 이동을 흉내 낸다: 실제 이동은 막고 클릭만 전달 */
  const click = (name: string) => {
    const event = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
    link(name).addEventListener("click", (e) => e.preventDefault(), { once: true });
    act(() => {
      link(name).dispatchEvent(event);
    });
  };
  const arrive = (pathname: string) => {
    location.pathname = pathname;
    view.rerender(page());
  };
  return { bar, click, arrive };
}

describe("화면 맨 위 진행 막대", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    location.pathname = "/";
    location.search = "";
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("이동이 0.15초를 넘기면 나타나고, 도착하면 사라진다", () => {
    const { bar, click, arrive } = setup();
    click("랭킹");
    act(() => vi.advanceTimersByTime(100));
    expect(bar()).toBeNull();
    act(() => vi.advanceTimersByTime(100));
    expect(bar()).not.toBeNull();
    arrive("/ranking");
    expect(bar()).toBeNull();
  });

  it("빨리 끝나는 이동에서는 아예 나타나지 않는다", () => {
    const { bar, click, arrive } = setup();
    click("랭킹");
    act(() => vi.advanceTimersByTime(50));
    arrive("/ranking");
    act(() => vi.advanceTimersByTime(500));
    expect(bar()).toBeNull();
  });

  it("지금 주소나 바깥 사이트 링크에는 반응하지 않는다", () => {
    const { bar, click } = setup();
    click("홈");
    click("바깥");
    act(() => vi.advanceTimersByTime(1000));
    expect(bar()).toBeNull();
  });

  it("이동이 끝나지 않아도 10초 뒤에는 거둔다", () => {
    const { bar, click } = setup();
    click("랭킹");
    act(() => vi.advanceTimersByTime(1000));
    expect(bar()).not.toBeNull();
    act(() => vi.advanceTimersByTime(10_000));
    expect(bar()).toBeNull();
  });
});
