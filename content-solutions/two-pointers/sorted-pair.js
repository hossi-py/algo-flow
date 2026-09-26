function solution(prices, target) {
  let l = 0;
  let r = prices.length - 1;
  while (l < r) {
    const s = prices[l] + prices[r];
    if (s === target) return [l, r];
    if (s < target) l++;
    else r--;
  }
  return [];
}
