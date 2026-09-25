function solution(n) {
  const cols = new Set();
  const diag1 = new Set();
  const diag2 = new Set();
  function place(row) {
    if (row === n) return 1;
    let count = 0;
    for (let c = 0; c < n; c += 1) {
      if (cols.has(c) || diag1.has(row - c) || diag2.has(row + c)) continue;
      cols.add(c);
      diag1.add(row - c);
      diag2.add(row + c);
      count += place(row + 1);
      cols.delete(c);
      diag1.delete(row - c);
      diag2.delete(row + c);
    }
    return count;
  }
  return place(0);
}
