const DIRECTIONS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function solution(garden) {
  const n = garden.length;
  const m = garden[0].length;
  const visited = Array.from({ length: n }, () => new Array(m).fill(false));

  function dfs(r, c) {
    visited[r][c] = true;
    let size = 1;
    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      if (0 <= nr && nr < n && 0 <= nc && nc < m && garden[nr][nc] === "1" && !visited[nr][nc]) {
        size += dfs(nr, nc);
      }
    }
    return size;
  }

  const sizes = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < m; c++) {
      if (garden[r][c] === "1" && !visited[r][c]) {
        sizes.push(dfs(r, c));
      }
    }
  }

  return sizes.sort((a, b) => a - b);
}
