function solution(stations, homes) {
  const s = [...stations].sort((a, b) => a - b);
  const lowerBound = (x) => {
    let lo = 0;
    let hi = s.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (s[mid] >= x) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  };
  return homes.map((h) => {
    const i = lowerBound(h);
    let best = Infinity;
    if (i < s.length) best = s[i] - h;
    if (i > 0) best = Math.min(best, h - s[i - 1]);
    return best;
  });
}
