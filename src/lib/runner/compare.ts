import type { CompareMode, JsonValue } from "@/types";

/** 객체 키를 정렬한 안정적인 JSON 문자열 (정렬·비교 키로 사용) */
export function canonicalJson(value: JsonValue): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key] ?? null)}`).join(",")}}`;
}

function deepEqual(a: JsonValue, b: JsonValue, tolerance: number | null): boolean {
  if (typeof a === "number" && typeof b === "number") {
    return tolerance === null ? a === b : Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(b));
  }
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return a === b;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, i) => deepEqual(item, b[i] ?? null, tolerance));
  }
  const objA = a as Record<string, JsonValue>;
  const objB = b as Record<string, JsonValue>;
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => key in objB && deepEqual(objA[key] ?? null, objB[key] ?? null, tolerance));
}

/**
 * 실제 반환값과 기대값을 비교한다.
 * - exact: 구조와 값이 완전히 같아야 함 (JSON 기준이라 1과 1.0은 같다)
 * - unordered: 최상위 배열의 순서는 무시 (원소는 exact 비교)
 * - float: 숫자는 상대/절대 오차 tolerance 이내면 같다고 본다
 */
export function isAnswerCorrect(actual: JsonValue, expected: JsonValue, mode: CompareMode): boolean {
  switch (mode.type) {
    case "exact":
      return deepEqual(actual, expected, null);
    case "float":
      return deepEqual(actual, expected, mode.tolerance);
    case "unordered": {
      if (!Array.isArray(actual) || !Array.isArray(expected)) return deepEqual(actual, expected, null);
      if (actual.length !== expected.length) return false;
      const sortKeys = (list: JsonValue[]) => list.map(canonicalJson).sort();
      const a = sortKeys(actual);
      const b = sortKeys(expected);
      return a.every((key, i) => key === b[i]);
    }
  }
}
