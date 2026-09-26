function solution(votes) {
  const count = new Map();
  for (const v of votes) {
    count.set(v, (count.get(v) ?? 0) + 1);
  }
  let best = null;
  for (const [name, c] of count) {
    if (best === null || c > count.get(best) || (c === count.get(best) && name < best)) {
      best = name;
    }
  }
  return best;
}
