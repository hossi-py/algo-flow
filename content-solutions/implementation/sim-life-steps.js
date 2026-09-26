function solution(grid, k) {
  const rows = grid.length;
  const cols = grid[0].length;
  for (let t = 0; t < k; t++) {
    const next = [];
    for (let r = 0; r < rows; r++) {
      let row = "";
      for (let c = 0; c < cols; c++) {
        let cnt = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === "#") cnt++;
          }
        }
        const alive = grid[r][c] === "#";
        row += cnt === 3 || (alive && cnt === 2) ? "#" : ".";
      }
      next.push(row);
    }
    grid = next;
  }
  return grid;
}
