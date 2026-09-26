function solution(grid) {
  const g = grid.map((row) => row.split(""));
  const n = g.length;
  const m = g[0].length;
  for (let c = 0; c < m; c++) {
    let land = n - 1;
    for (let r = n - 1; r >= 0; r--) {
      const ch = g[r][c];
      if (ch === "#") land = r - 1;
      else if (ch !== ".") {
        g[r][c] = ".";
        g[land][c] = ch;
        land--;
      }
    }
  }
  return g.map((row) => row.join(""));
}
