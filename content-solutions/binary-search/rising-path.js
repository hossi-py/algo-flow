function solution(stones) {
  const tails = [];
  for (const x of stones) {
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] >= x) hi = mid;
      else lo = mid + 1;
    }
    tails[lo] = x;
  }
  return tails.length;
}
