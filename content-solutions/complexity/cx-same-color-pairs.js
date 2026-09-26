function solution(colors) {
  const count = new Array(100).fill(0);
  for (const c of colors) count[c]++;
  let total = 0;
  for (const c of count) total += (c * (c - 1)) / 2;
  return total;
}
