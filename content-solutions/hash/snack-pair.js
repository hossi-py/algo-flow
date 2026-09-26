function solution(prices, budget) {
  const seen = new Map();
  for (let j = 0; j < prices.length; j++) {
    const need = budget - prices[j];
    if (seen.has(need)) return [seen.get(need), j];
    if (!seen.has(prices[j])) seen.set(prices[j], j);
  }
  return [];
}
