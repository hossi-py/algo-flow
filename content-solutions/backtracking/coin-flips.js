function solution(n) {
  const result = [];
  const path = [];
  function pick() {
    if (path.length === n) {
      result.push(path.join(""));
      return;
    }
    for (const face of ["H", "T"]) {
      path.push(face);
      pick();
      path.pop();
    }
  }
  pick();
  return result;
}
