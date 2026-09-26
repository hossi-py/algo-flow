function solution(times) {
  let now = 0;
  let total = 0;
  for (const t of [...times].sort((a, b) => a - b)) {
    now += t;
    total += now;
  }
  return total;
}
