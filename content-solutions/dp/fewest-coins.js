function solution(coins, amount) {
  const fewest = Array(amount + 1).fill(Infinity);
  fewest[0] = 0;
  for (const c of coins) {
    for (let a = c; a <= amount; a++) fewest[a] = Math.min(fewest[a], fewest[a - c] + 1);
  }
  return fewest[amount] === Infinity ? -1 : fewest[amount];
}
