function solution(meetings) {
  const events = [];
  for (const [s, e] of meetings) events.push([s, 1], [e, -1]);
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let now = 0;
  let best = 0;
  for (const [, d] of events) {
    now += d;
    best = Math.max(best, now);
  }
  return best;
}
