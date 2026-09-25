import { z } from "zod";

/**
 * 에러 모니터링 공통 규칙 (브라우저·서버 모두 쓴다).
 * 저장 전에 길이를 자르고, 주소의 쿼리와 메시지 속 이메일·토큰을 가려 개인정보가 남지 않게 한다.
 */

/** server: onRequestError · client: 처리되지 않은 브라우저 에러 · boundary: 에러 화면(error.tsx)이 뜬 에러 · engine: 채점 엔진 로딩·충돌 */
export const ERROR_SOURCES = ["server", "client", "boundary", "engine"] as const;
export type ErrorSource = (typeof ERROR_SOURCES)[number];

export interface ErrorEvent {
  source: ErrorSource;
  message: string;
  stack: string | null;
  /** 서버 에러를 클라이언트 에러 화면과 이어 주는 Next.js 식별자 */
  digest: string | null;
  /** 쿼리를 뺀 주소 */
  path: string | null;
  /** 서버: 라우트 파일 경로 (예: /problems/[slug]) */
  routePath: string | null;
  /** 서버: render · route · action · proxy */
  routeType: string | null;
  userAgent: string | null;
  release: string | null;
  fingerprint: string;
}

export const LIMITS = { message: 500, stack: 4000, path: 300, userAgent: 300, digest: 100 } as const;

/** 브라우저가 /api/errors로 보내는 내용 (서버 전용 source는 받지 않는다) */
export const clientReportSchema = z.object({
  source: z.enum(["client", "boundary", "engine"]),
  message: z.string().min(1).max(5_000),
  stack: z.string().max(20_000).nullish(),
  digest: z.string().max(LIMITS.digest).nullish(),
  path: z.string().max(2_000).nullish(),
  release: z.string().max(100).nullish(),
});
export type ClientReport = z.infer<typeof clientReportSchema>;

function clip(value: string | null | undefined, max: number): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  if (trimmed === "") return null;
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed;
}

/** 도메인이 영문자로 끝나는 이메일만 (pnpm 경로 `next@16.3.6_@babel+core@7.2` 같은 건 건드리지 않는다) */
const EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[A-Za-z]{2,}\b/g;
/** JWT·API 키 모양 (스택의 긴 청크 파일 이름은 그대로 둔다) */
const TOKEN = /\b(?:eyJ[\w-]+\.[\w-]+\.[\w-]+|sk-[\w-]{10,})/g;
/** token=…, password: … 처럼 이름 뒤에 오는 비밀 값 */
const SECRET_PAIR = /\b(token|key|secret|password|passwd|code|auth)(\s*[=:]\s*)[^\s&"',;]+/gi;

/** 메시지·스택 속 이메일과 토큰을 가린다 */
export function redact(text: string): string {
  return text.replace(EMAIL, "[email]").replace(TOKEN, "[token]").replace(SECRET_PAIR, "$1$2[redacted]");
}

/** 쿼리·해시를 뺀 경로만 남긴다 (검색어·토큰이 쿼리에 들어올 수 있어서) */
export function cleanPath(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let pathname = raw;
  try {
    pathname = new URL(raw, "http://local").pathname;
  } catch {
    pathname = raw.split(/[?#]/)[0] ?? raw;
  }
  return clip(pathname, LIMITS.path);
}

/**
 * 같은 원인의 에러를 묶는 지문. 메시지 속 숫자·따옴표 안 값은 달라도 같은 에러로 보고,
 * 스택의 첫 줄(에러가 난 함수)을 함께 쓴다.
 */
export function fingerprint(source: ErrorSource, message: string, stack: string | null): string {
  const normalizedMessage = message
    .replace(/(["'`]).*?\1/g, "?")
    .replace(/\d+/g, "#")
    .slice(0, 200);
  const firstFrame =
    stack
      ?.split("\n")
      .map((line) => line.trim())
      .find((line) => line.startsWith("at ") || line.includes("@"))
      ?.replace(/:\d+:\d+\)?$/, "")
      .replace(/\?[^\s)]*/, "") ?? "";
  return hash(`${source}|${normalizedMessage}|${firstFrame}`);
}

/** 짧은 결정적 해시 (FNV-1a 32비트 두 번) */
function hash(text: string): string {
  let a = 0x811c9dc5;
  let b = 0x01000193;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    a = Math.imul(a ^ code, 0x01000193) >>> 0;
    b = Math.imul(b ^ code, 0x811c9dc5) >>> 0;
  }
  return a.toString(16).padStart(8, "0") + b.toString(16).padStart(8, "0");
}

export interface RawError {
  source: ErrorSource;
  message: string;
  stack?: string | null;
  digest?: string | null;
  path?: string | null;
  routePath?: string | null;
  routeType?: string | null;
  userAgent?: string | null;
  release?: string | null;
}

/** 저장할 수 있는 모양으로 정리한다 */
export function toErrorEvent(raw: RawError): ErrorEvent {
  const message = clip(redact(raw.message), LIMITS.message) ?? "(메시지 없음)";
  const stack = clip(raw.stack ? redact(raw.stack) : null, LIMITS.stack);
  return {
    source: raw.source,
    message,
    stack,
    digest: clip(raw.digest, LIMITS.digest),
    path: cleanPath(raw.path),
    routePath: clip(raw.routePath, LIMITS.path),
    routeType: clip(raw.routeType, 20),
    userAgent: clip(raw.userAgent, LIMITS.userAgent),
    release: clip(raw.release, 100),
    fingerprint: fingerprint(raw.source, message, stack),
  };
}

/** throw된 값에서 메시지와 스택을 꺼낸다 (Error가 아닐 수도 있다) */
export function describeThrown(value: unknown): { message: string; stack: string | null; digest: string | null } {
  // Error가 아니어도 name·message가 있으면 에러로 본다 (DOMException, 다른 창의 Error 등)
  if (value instanceof Error || (typeof value === "object" && value !== null && "message" in value)) {
    const error = value as { name?: unknown; message?: unknown; stack?: unknown; digest?: unknown };
    const name = typeof error.name === "string" && error.name ? error.name : "Error";
    return {
      message: `${name}: ${String(error.message)}`,
      stack: typeof error.stack === "string" ? error.stack : null,
      digest: typeof error.digest === "string" ? error.digest : null,
    };
  }
  if (typeof value === "string") return { message: value, stack: null, digest: null };
  try {
    return { message: JSON.stringify(value) ?? String(value), stack: null, digest: null };
  } catch {
    return { message: String(value), stack: null, digest: null };
  }
}
