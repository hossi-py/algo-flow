function solution(text, word) {
  const m = word.length;
  const need = Array(26).fill(0);
  for (const c of word) need[c.charCodeAt(0) - 97]++;
  const have = Array(26).fill(0);
  const result = [];
  for (let i = 0; i < text.length; i++) {
    have[text.charCodeAt(i) - 97]++;
    if (i >= m) have[text.charCodeAt(i - m) - 97]--;
    if (i >= m - 1 && have.every((v, j) => v === need[j])) result.push(i - m + 1);
  }
  return result;
}
