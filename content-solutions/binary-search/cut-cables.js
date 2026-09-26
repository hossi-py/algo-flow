function solution(vines, k) {
  let lo = 1;
  let hi = Math.max(...vines);
  let answer = 0;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    let pieces = 0;
    for (const v of vines) pieces += Math.floor(v / mid);
    if (pieces >= k) {
      answer = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return answer;
}
