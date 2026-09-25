/** 마지막 글자에 받침이 있는지 (한글이 아니면 null) */
function hasFinalConsonant(word: string): boolean | null {
  const last = word.trim().at(-1);
  if (!last) return null;
  const code = last.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return null;
  return (code - 0xac00) % 28 !== 0;
}

/** 받침에 맞는 조사만 돌려준다. 예: particle("최단 거리", "이", "가") → "가" */
export function particle(word: string, withFinal: string, withoutFinal: string): string {
  const final = hasFinalConsonant(word);
  if (final === null) return `${withFinal}(${withoutFinal})`;
  return final ? withFinal : withoutFinal;
}
