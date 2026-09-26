function solution(trees, m) {
  let lo = 0;
  let hi = Math.max(...trees);
  let answer = 0;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    let got = 0;
    for (const t of trees) if (t > mid) got += t - mid;
    if (got >= m) {
      answer = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return answer;
}
