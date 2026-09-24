function solution(weights, limit) {
  const sorted = [...weights].sort((p, q) => p - q);
  const n = sorted.length;
  function go(start, total) {
    let count = 0;
    for (let i = start; i < n; i += 1) {
      const w = total + sorted[i];
      if (w > limit) break;
      if (w === limit) count += 1;
      else count += go(i + 1, w);
    }
    return count;
  }
  return go(0, 0);
}
