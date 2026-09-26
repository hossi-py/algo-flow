function solution(n, m) {
  const board = Array.from({ length: n }, () => new Array(m).fill(0));
  const dr = [0, 1, 0, -1];
  const dc = [1, 0, -1, 0];
  let r = 0;
  let c = 0;
  let d = 0;
  for (let k = 1; k <= n * m; k++) {
    board[r][c] = k;
    const nr = r + dr[d];
    const nc = c + dc[d];
    if (nr < 0 || nr >= n || nc < 0 || nc >= m || board[nr][nc] !== 0) d = (d + 1) % 4;
    r += dr[d];
    c += dc[d];
  }
  return board;
}
