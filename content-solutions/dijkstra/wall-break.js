class Heap {
  constructor(less) {
    this.a = [];
    this.less = less;
  }
  get size() {
    return this.a.length;
  }
  peek() {
    return this.a[0];
  }
  push(x) {
    const a = this.a;
    a.push(x);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (!this.less(a[i], a[p])) break;
      [a[i], a[p]] = [a[p], a[i]];
      i = p;
    }
  }
  pop() {
    const a = this.a;
    const top = a[0];
    const last = a.pop();
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let m = i;
        if (l < a.length && this.less(a[l], a[m])) m = l;
        if (r < a.length && this.less(a[r], a[m])) m = r;
        if (m === i) break;
        [a[i], a[m]] = [a[m], a[i]];
        i = m;
      }
    }
    return top;
  }
}

function solution(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const broken = Array.from({ length: rows }, () => new Array(cols).fill(Infinity));
  broken[0][0] = 0;
  const heap = new Heap((x, y) => x[0] < y[0]);
  heap.push([0, 0, 0]);
  while (heap.size > 0) {
    const [b, r, c] = heap.pop();
    if (r === rows - 1 && c === cols - 1) return b;
    if (b > broken[r][c]) continue;
    for (const [nr, nc] of [
      [r + 1, c],
      [r - 1, c],
      [r, c + 1],
      [r, c - 1],
    ]) {
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      const nb = b + (grid[nr][nc] === "1" ? 1 : 0);
      if (nb < broken[nr][nc]) {
        broken[nr][nc] = nb;
        heap.push([nb, nr, nc]);
      }
    }
  }
  return -1;
}
