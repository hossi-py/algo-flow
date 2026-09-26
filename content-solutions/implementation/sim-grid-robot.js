function solution(grid, commands) {
  const rows = grid.length;
  const cols = grid[0].length;
  const dr = [-1, 0, 1, 0];
  const dc = [0, 1, 0, -1];
  let r = 0;
  let c = 0;
  grid.forEach((row, i) => {
    if (row.includes("S")) {
      r = i;
      c = row.indexOf("S");
    }
  });
  let d = 0;
  for (const ch of commands) {
    if (ch === "L") d = (d + 3) % 4;
    else if (ch === "R") d = (d + 1) % 4;
    else {
      const nr = r + dr[d];
      const nc = c + dc[d];
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== "#") {
        r = nr;
        c = nc;
      }
    }
  }
  return [r, c];
}
