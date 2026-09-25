function solution(n, k) {
  function letter(level, pos) {
    if (level === 1) return "a";
    const half = 2 ** (level - 1) - 1;
    if (pos <= half) return letter(level - 1, pos);
    if (pos === half + 1) return "b";
    const c = letter(level - 1, pos - half - 1);
    return c === "a" ? "b" : "a";
  }
  return letter(n, k);
}
