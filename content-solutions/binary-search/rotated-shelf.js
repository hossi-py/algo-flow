function solution(shelf, queries) {
  const n = shelf.length;
  let lo = 0;
  let hi = n - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (shelf[mid] > shelf[n - 1]) lo = mid + 1;
    else hi = mid;
  }
  const p = lo;
  const find = (x, l, h) => {
    while (l <= h) {
      const mid = (l + h) >> 1;
      if (shelf[mid] === x) return mid;
      if (shelf[mid] < x) l = mid + 1;
      else h = mid - 1;
    }
    return -1;
  };
  return queries.map((x) => (x <= shelf[n - 1] ? find(x, p, n - 1) : find(x, 0, p - 1)));
}
