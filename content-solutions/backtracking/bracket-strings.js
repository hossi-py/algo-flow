function solution(n) {
  const result = [];
  function make(s, open, close) {
    if (s.length === 2 * n) {
      result.push(s);
      return;
    }
    if (open < n) make(s + "(", open + 1, close);
    if (close < open) make(s + ")", open, close + 1);
  }
  make("", 0, 0);
  return result;
}
