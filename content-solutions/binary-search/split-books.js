function solution(pages, k) {
  const people = (x) => {
    let count = 1;
    let cur = 0;
    for (const p of pages) {
      if (cur + p > x) {
        count++;
        cur = 0;
      }
      cur += p;
    }
    return count;
  };
  let lo = Math.max(...pages);
  let hi = pages.reduce((a, b) => a + b, 0);
  let answer = hi;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (people(mid) <= k) {
      answer = mid;
      hi = mid - 1;
    } else lo = mid + 1;
  }
  return answer;
}
