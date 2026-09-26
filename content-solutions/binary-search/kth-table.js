function solution(n, k) {
  const count = (x) => {
    let total = 0;
    for (let i = 1; i <= n; i++) total += Math.min(n, Math.floor(x / i));
    return total;
  };
  let lo = 1;
  let hi = n * n;
  let answer = hi;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (count(mid) >= k) {
      answer = mid;
      hi = mid - 1;
    } else lo = mid + 1;
  }
  return answer;
}
