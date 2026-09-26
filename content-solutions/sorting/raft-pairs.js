function solution(weights, limit) {
  const w = [...weights].sort((a, b) => a - b);
  let i = 0;
  let j = w.length - 1;
  let rafts = 0;
  while (i <= j) {
    if (w[i] + w[j] <= limit) i++;
    j--;
    rafts++;
  }
  return rafts;
}
