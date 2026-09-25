function solution(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  return grid.map((line, r) =>
    [...line].map((cell, c) => {
      if (cell === "#") return -1;
      let count = 0;
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === ".") count += 1;
      }
      return count;
    }),
  );
}
