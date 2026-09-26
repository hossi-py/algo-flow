function solution(heights, ranges) {
  const s = [...heights].sort((a, b) => a - b);
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
  return ranges.map(([l, r]) => lowerBound(r + 1) - lowerBound(l));
}
