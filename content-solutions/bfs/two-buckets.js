function solution(a, b, k) {
  const dist = Array.from({ length: a + 1 }, () => new Array(b + 1).fill(-1));
  dist[0][0] = 0;
  const queue = [[0, 0]];
  let head = 0;
  while (head < queue.length) {
    const [x, y] = queue[head++];
    if (x === k || y === k) return dist[x][y];
    const ab = Math.min(x, b - y);
    const ba = Math.min(y, a - x);
    const next = [
      [a, y],
      [x, b],
      [0, y],
      [x, 0],
      [x - ab, y + ab],
      [x + ba, y - ba],
    ];
    for (const [nx, ny] of next) {
      if (dist[nx][ny] === -1) {
        dist[nx][ny] = dist[x][y] + 1;
        queue.push([nx, ny]);
      }
    }
  }
  return -1;
}
