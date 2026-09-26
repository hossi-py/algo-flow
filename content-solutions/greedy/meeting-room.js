function solution(meetings) {
  const sorted = [...meetings].sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  let lastEnd = -Infinity;
  let count = 0;
  for (const [s, e] of sorted) {
    if (s >= lastEnd) {
      count++;
      lastEnd = e;
    }
  }
  return count;
}
