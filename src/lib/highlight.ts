export interface TextSegment {
  text: string;
  /** 하이라이트할 문구에 해당하는 조각인지 */
  hit: boolean;
}

/**
 * 지문을 하이라이트 문구 기준으로 조각낸다. 같은 문구가 여러 번 나오면 모두 칠하고,
 * 겹치거나 맞닿은 구간은 하나로 합친다. 조각을 이어 붙이면 항상 원문과 같다.
 */
export function highlightSegments(text: string, phrases: readonly string[]): TextSegment[] {
  const ranges: [number, number][] = [];
  for (const phrase of phrases) {
    if (phrase.length === 0) continue;
    let from = text.indexOf(phrase);
    while (from !== -1) {
      ranges.push([from, from + phrase.length]);
      from = text.indexOf(phrase, from + 1);
    }
  }
  if (ranges.length === 0) return text.length > 0 ? [{ text, hit: false }] : [];

  ranges.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const [start, end] of ranges) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
  }

  const segments: TextSegment[] = [];
  let cursor = 0;
  for (const [start, end] of merged) {
    if (start > cursor) segments.push({ text: text.slice(cursor, start), hit: false });
    segments.push({ text: text.slice(start, end), hit: true });
    cursor = end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), hit: false });
  return segments;
}
