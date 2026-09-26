function solution(scores) {
  const count = Array(101).fill(0);
  for (const s of scores) count[s]++;
  const higher = Array(101).fill(0);
  for (let v = 99; v >= 0; v--) higher[v] = higher[v + 1] + count[v + 1];
  return scores.map((s) => higher[s] + 1);
}
