function solution(piles, hours) {
  let lo = 1;
  let hi = Math.max(...piles);
  let answer = hi;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    let need = 0;
    for (const p of piles) need += Math.ceil(p / mid);
    if (need <= hours) {
      answer = mid;
      hi = mid - 1;
    } else lo = mid + 1;
  }
  return answer;
}
