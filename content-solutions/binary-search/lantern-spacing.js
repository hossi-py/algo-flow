function solution(hooks, c) {
  const h = [...hooks].sort((a, b) => a - b);
  const count = (d) => {
    let placed = 1;
    let last = h[0];
    for (let i = 1; i < h.length; i++) {
      if (h[i] - last >= d) {
        placed++;
        last = h[i];
      }
    }
    return placed;
  };
  let lo = 1;
  let hi = h[h.length - 1] - h[0];
  let answer = 0;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (count(mid) >= c) {
      answer = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return answer;
}
