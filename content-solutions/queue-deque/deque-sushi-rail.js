function solution(n, picks) {
  let rail = Array.from({ length: n }, (_, i) => i + 1);
  let total = 0;
  for (const p of picks) {
    const idx = rail.indexOf(p);
    total += Math.min(idx, rail.length - idx);
    rail = [...rail.slice(idx), ...rail.slice(0, idx)];
    rail.shift();
  }
  return total;
}
