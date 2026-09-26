function solution(words) {
  return [...new Set(words)].sort((a, b) => a.length - b.length || (a < b ? -1 : a > b ? 1 : 0));
}
