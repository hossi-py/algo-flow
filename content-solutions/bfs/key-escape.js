function solution(room) {
  const rows = room.length;
  const cols = room[0].length;
  const visited = [0, 1].map(() => Array.from({ length: rows }, () => new Array(cols).fill(false)));
  let sr = 0;
  let sc = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (room[r][c] === "S") {
        sr = r;
        sc = c;
      }
    }
  }
  visited[0][sr][sc] = true;
  const queue = [[sr, sc, 0, 0]];
  for (let head = 0; head < queue.length; head++) {
    const [r, c, key, d] = queue[head];
    if (room[r][c] === "E") return d;
    for (const [dr, dc] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || room[nr][nc] === "#") continue;
      if (room[nr][nc] === "D" && !key) continue;
      const nkey = key || room[nr][nc] === "K" ? 1 : 0;
      if (!visited[nkey][nr][nc]) {
        visited[nkey][nr][nc] = true;
        queue.push([nr, nc, nkey, d + 1]);
      }
    }
  }
  return -1;
}
