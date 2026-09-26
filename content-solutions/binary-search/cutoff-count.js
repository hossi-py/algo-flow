function solution(scores, queries) {
  const s = [...scores].sort((a, b) => a - b);
  const lowerBound = (q) => {
    let lo = 0;
    let hi = s.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (s[mid] >= q) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  };
  return queries.map((q) => s.length - lowerBound(q));
}
