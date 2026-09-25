function solution(maze) {
  const rows = maze.length;
  const cols = maze[0].length;
  const dist = Array.from({ length: rows }, () => new Array(cols).fill(-1));
  const queue = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (maze[r][c] === "S") {
        dist[r][c] = 0;
        queue.push([r, c]);
      }
    }
  }
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  let head = 0;
  while (head < queue.length) {
    const [r, c] = queue[head++];
    if (maze[r][c] === "E") return dist[r][c];
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && maze[nr][nc] !== "#" && dist[nr][nc] === -1) {
        dist[nr][nc] = dist[r][c] + 1;
        queue.push([nr, nc]);
      }
    }
  }
  return -1;
}
