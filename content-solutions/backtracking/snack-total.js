function solution(prices, money) {
  const n = prices.length;
  function go(i, total) {
    if (i === n) return total === money ? 1 : 0;
    return go(i + 1, total + prices[i]) + go(i + 1, total);
  }
  return go(0, 0);
}
