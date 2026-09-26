function solution(coins, amount) {
  const MOD = 1_000_000_007;
  const ways = Array(amount + 1).fill(0);
  ways[0] = 1;
  for (const c of coins) {
    for (let a = c; a <= amount; a++) ways[a] = (ways[a] + ways[a - c]) % MOD;
  }
  return ways[amount];
}
