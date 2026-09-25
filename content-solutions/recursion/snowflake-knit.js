function solution(k) {
  function pattern(level) {
    if (level === 0) return ["*"];
    const small = pattern(level - 1);
    const blank = " ".repeat(small.length);
    const top = small.map((row) => row.repeat(3));
    const mid = small.map((row) => row + blank + row);
    return [...top, ...mid, ...top];
  }
  return pattern(k);
}
