function solution(times, m) {
  let lo = 1;
  let hi = Math.min(...times) * m;
  let answer = hi;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    let made = 0;
    for (const t of times) {
      made += Math.floor(mid / t);
      if (made >= m) break;
    }
    if (made >= m) {
      answer = mid;
      hi = mid - 1;
    } else lo = mid + 1;
  }
  return answer;
}
