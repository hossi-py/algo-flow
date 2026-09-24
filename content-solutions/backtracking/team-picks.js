function solution(n, k) {
  const result = [];
  const path = [];
  function pick(start) {
    if (path.length === k) {
      result.push([...path]);
      return;
    }
    for (let i = start; i <= n; i += 1) {
      path.push(i);
      pick(i + 1);
      path.pop();
    }
  }
  pick(1);
  return result;
}
