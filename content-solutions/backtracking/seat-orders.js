function solution(names) {
  const n = names.length;
  const used = new Array(n).fill(false);
  const path = [];
  const result = [];
  function place() {
    if (path.length === n) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < n; i += 1) {
      if (!used[i]) {
        used[i] = true;
        path.push(names[i]);
        place();
        path.pop();
        used[i] = false;
      }
    }
  }
  place();
  return result;
}
