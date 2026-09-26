function solution(baskets) {
  const a = [...baskets];
  let w = 0;
  for (const x of baskets) {
    if (x !== 0) {
      a[w] = x;
      w++;
    }
  }
  a.fill(0, w);
  return a;
}
