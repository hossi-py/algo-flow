function solution(neighbors) {
  let total = 0;
  for (const islands of neighbors) total += islands.length;
  return total / 2;
}
