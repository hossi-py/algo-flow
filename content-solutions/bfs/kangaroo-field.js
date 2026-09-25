const JUMPS = [
  [1, 2],
  [2, 1],
  [2, -1],
  [1, -2],
  [-1, -2],
  [-2, -1],
  [-2, 1],
  [-1, 2],
];

function solution(field) {
  const rows = field.length;
  const cols = field[0].length;
  const dist = Array.from({ length: rows }, () => new Array(cols).fill(-1));
  let start = [0, 0];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) if (field[r][c] === "S") start = [r, c];
  }
  dist[start[0]][start[1]] = 0;
  const queue = [start];
  for (let head = 0; head < queue.length; head++) {
    const [r, c] = queue[head];
    if (field[r][c] === "E") return dist[r][c];
    for (const [dr, dc] of JUMPS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && field[nr][nc] !== "#" && dist[nr][nc] === -1) {
        dist[nr][nc] = dist[r][c] + 1;
        queue.push([nr, nc]);
      }
    }
  }
  return -1;
}
