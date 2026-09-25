import { describe, expect, it } from "vitest";
import {
  LIMITS,
  cleanPath,
  clientReportSchema,
  describeThrown,
  fingerprint,
  redact,
  toErrorEvent,
} from "@/lib/monitoring/event";

describe("개인정보 가리기", () => {
  it("메시지 속 이메일과 토큰을 가린다", () => {
    expect(redact("nodi@example.com 로그인 실패")).toBe("[email] 로그인 실패");
    expect(redact("key sk-ant-api03-abcdefghijklmnop 거절")).toBe("key [token] 거절");
    expect(redact("jwt eyJhbGciOi.eyJzdWIiOi.c2lnbmF0dXJl 만료")).toBe("jwt [token] 만료");
    expect(redact("평범한 메시지 42")).toBe("평범한 메시지 42");
    expect(redact("failed: token=abc123&x=1, password: hunter2")).toBe(
      "failed: token=[redacted]&x=1, password: [redacted]",
    );
  });

  it("스택 추적에 필요한 경로와 파일 이름은 가리지 않는다", () => {
    const frame =
      "at render (node_modules/.pnpm/next@16.3.6_@babel+core@7.2_c25acd63a173a11f93c41cfe894097bb/node_modules/next/dist/x.js:88:1)";
    expect(redact(frame)).toBe(frame);
    const chunk = "at progress (http://localhost:3000/_next/static/chunks/0f3a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d._.js:2711:13)";
    expect(redact(chunk)).toBe(chunk);
  });

  it("주소는 쿼리와 해시를 빼고 경로만 남긴다", () => {
    expect(cleanPath("/auth/callback?code=secret&next=/me")).toBe("/auth/callback");
    expect(cleanPath("https://algo-flow.app/problems/stack-plate-tower#hint")).toBe("/problems/stack-plate-tower");
    expect(cleanPath("")).toBeNull();
    expect(cleanPath(null)).toBeNull();
  });
});

describe("저장할 모양으로 정리", () => {
  it("길이를 제한하고 빈 값은 null로 둔다", () => {
    const event = toErrorEvent({
      source: "client",
      message: "가".repeat(2_000),
      stack: "at x\n".repeat(5_000),
      path: "/me?tab=settings",
      userAgent: "  ",
    });
    expect(event.message.length).toBe(LIMITS.message);
    expect(event.message.endsWith("…")).toBe(true);
    expect(event.stack?.length).toBe(LIMITS.stack);
    expect(event.path).toBe("/me");
    expect(event.userAgent).toBeNull();
    expect(event.fingerprint).toMatch(/^[0-9a-f]{16}$/);
  });

  it("메시지가 비어 있어도 저장할 수 있다", () => {
    expect(toErrorEvent({ source: "server", message: "   " }).message).toBe("(메시지 없음)");
  });
});

describe("같은 원인끼리 묶는 지문", () => {
  const stack = "TypeError: x\n    at solve (https://app/_next/static/chunks/page.js:10:20)";

  it("숫자·따옴표 안 값만 다르면 같은 지문이다", () => {
    expect(fingerprint("client", "Cannot read index 3 of 'abc'", stack)).toBe(
      fingerprint("client", "Cannot read index 7 of 'xyz'", stack.replace("10:20", "11:5")),
    );
  });

  it("메시지·출처·에러 난 함수가 다르면 다른 지문이다", () => {
    const base = fingerprint("client", "boom", stack);
    expect(fingerprint("client", "bang", stack)).not.toBe(base);
    expect(fingerprint("server", "boom", stack)).not.toBe(base);
    expect(fingerprint("client", "boom", stack.replace("solve", "render"))).not.toBe(base);
  });
});

describe("throw된 값 읽기", () => {
  it("Error는 이름·메시지·스택·digest를, 그 밖의 값은 글자로 바꾼다", () => {
    const error = Object.assign(new TypeError("망가짐"), { digest: "123456" });
    expect(describeThrown(error)).toMatchObject({ message: "TypeError: 망가짐", digest: "123456" });
    expect(describeThrown(error).stack).toContain("망가짐");
    expect(describeThrown("문자열")).toEqual({ message: "문자열", stack: null, digest: null });
    expect(describeThrown({ code: 1 }).message).toBe('{"code":1}');
    expect(describeThrown(undefined).message).toBe("undefined");
  });
});

describe("브라우저 보고 형식", () => {
  it("서버 전용 출처와 너무 긴 값은 받지 않는다", () => {
    expect(clientReportSchema.safeParse({ source: "client", message: "x" }).success).toBe(true);
    expect(clientReportSchema.safeParse({ source: "server", message: "x" }).success).toBe(false);
    expect(clientReportSchema.safeParse({ source: "client", message: "" }).success).toBe(false);
    expect(clientReportSchema.safeParse({ source: "client", message: "x".repeat(5_001) }).success).toBe(false);
  });
});
