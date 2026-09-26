function solution(n, secret) {
  let lo = 1;
  let hi = n;
  let count = 0;
  while (true) {
    const mid = Math.floor((lo + hi) / 2);
    count++;
    if (mid === secret) return count;
    if (mid < secret) lo = mid + 1;
    else hi = mid - 1;
  }
}
