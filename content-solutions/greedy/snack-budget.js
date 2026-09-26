function solution(prices, budget) {
  let count = 0;
  for (const p of [...prices].sort((a, b) => a - b)) {
    if (p > budget) break;
    budget -= p;
    count++;
  }
  return count;
}
