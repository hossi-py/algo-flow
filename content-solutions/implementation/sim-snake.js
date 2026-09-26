function solution(n, apples, times, dirs) {
  const dr = [0, 1, 0, -1];
  const dc = [1, 0, -1, 0];
  const key = (r, c) => r * n + c;
  const apple = new Set(apples.map(([r, c]) => key(r, c)));
  const occupied = new Set([key(0, 0)]);
  let d = 0;
  let t = 0;
  let k = 0;
  const cells = [[0, 0]];
  let tail = 0;
  for (;;) {
    t++;
    const [hr, hc] = cells[cells.length - 1];
    const nr = hr + dr[d];
    const nc = hc + dc[d];
    if (nr < 0 || nr >= n || nc < 0 || nc >= n || occupied.has(key(nr, nc))) return t;
    cells.push([nr, nc]);
    occupied.add(key(nr, nc));
    if (apple.has(key(nr, nc))) apple.delete(key(nr, nc));
    else {
      const [tr, tc] = cells[tail++];
      occupied.delete(key(tr, tc));
    }
    if (k < times.length && times[k] === t) {
      d = dirs[k] === "D" ? (d + 1) % 4 : (d + 3) % 4;
      k++;
    }
  }
}
