function solution(prices) {
  let hold = -Infinity;
  let sold = 0;
  let rest = 0;
  for (const p of prices) {
    const nextHold = Math.max(hold, rest - p);
    const nextSold = hold + p;
    const nextRest = Math.max(rest, sold);
    hold = nextHold;
    sold = nextSold;
    rest = nextRest;
  }
  return Math.max(sold, rest);
}
