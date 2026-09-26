function solution(coins, amount) {
  let count = 0;
  for (const coin of [...coins].sort((a, b) => b - a)) {
    count += Math.floor(amount / coin);
    amount %= coin;
  }
  return count;
}
