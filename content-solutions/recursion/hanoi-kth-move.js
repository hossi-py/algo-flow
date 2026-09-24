function solution(n, k) {
  function kth(m, a, b, c, order) {
    const half = 2 ** (m - 1) - 1;
    if (order <= half) return kth(m - 1, a, c, b, order);
    if (order === half + 1) return [a, b];
    return kth(m - 1, c, b, a, order - half - 1);
  }
  return kth(n, 1, 3, 2, k);
}
