function solution(weights, k) {
  const sorted = [...weights].sort((a, b) => b - a);
  return sorted[k - 1];
}
