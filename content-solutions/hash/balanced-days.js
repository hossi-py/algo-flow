function solution(days) {
  const first = new Map([[0, -1]]);
  let total = 0;
  let best = 0;
  for (let i = 0; i < days.length; i++) {
    total += days[i] === 1 ? 1 : -1;
    if (first.has(total)) best = Math.max(best, i - first.get(total));
    else first.set(total, i);
  }
  return best;
}
