function solution(matrix, k) {
  let a = matrix;
  for (let t = 0; t < k % 4; t++) {
    const n = a.length;
    const m = a[0].length;
    const b = Array.from({ length: m }, () => new Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < m; c++) b[c][n - 1 - r] = a[r][c];
    }
    a = b;
  }
  return a;
}
