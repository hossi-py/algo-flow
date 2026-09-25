import type { JsonValue, Language, ParamSpec, TypeNotation } from "@/types";

function inline(value: JsonValue): string {
  if (value === null) return "null";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value !== "object") return String(value);
  if (Array.isArray(value)) return `[${value.map(inline).join(", ")}]`;
  return `{${Object.entries(value)
    .map(([key, item]) => `${JSON.stringify(key)}: ${inline(item)}`)
    .join(", ")}}`;
}

/**
 * 테스트 입력·출력을 사람이 읽기 좋게 보여 준다.
 * 문자열 배열(격자 지도 등)은 한 줄에 한 행씩 펼친다.
 */
export function formatValue(value: JsonValue, maxLength = 1500): string {
  let text: string;
  if (Array.isArray(value) && value.length > 1 && value.every((item) => typeof item === "string")) {
    text = `[\n${value.map((item) => `  ${JSON.stringify(item)}`).join(",\n")}\n]`;
  } else {
    text = inline(value);
  }
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}\n… (전체 ${text.length.toLocaleString("ko-KR")}자 중 일부)`;
}

/** 인자 목록을 "이름 = 값" 줄들로 */
export function formatArgs(args: JsonValue[], params: ParamSpec[], maxLength = 1500): string {
  return args
    .map((arg, index) => {
      const name = params[index]?.name ?? `arg${index + 1}`;
      const body = formatValue(arg, maxLength);
      return body.includes("\n") ? `${name} =\n${body}` : `${name} = ${body}`;
    })
    .join("\n");
}

/** 언어별 함수 시그니처 표기. 예: solution(garden: list[str]) -> list[int] */
export function signatureText(params: ParamSpec[], returns: { type: TypeNotation }, language: Language): string {
  if (language === "java") {
    const java = (type: TypeNotation) => type.java ?? "Object";
    return `public ${java(returns.type)} solution(${params.map((p) => `${java(p.type)} ${p.name}`).join(", ")})`;
  }
  if (language === "python") {
    return `def solution(${params.map((p) => `${p.name}: ${p.type.python}`).join(", ")}) -> ${returns.type.python}`;
  }
  return `function solution(${params.map((p) => `${p.name}: ${p.type.javascript}`).join(", ")}): ${returns.type.javascript}`;
}
