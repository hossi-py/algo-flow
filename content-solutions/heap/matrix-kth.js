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

function solution(grid, k) {
  const n = grid.length;
  const h = new Heap((a, b) => a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]));
  for (let r = 0; r < n; r++) h.push([grid[r][0], r, 0]);
  let v = 0;
  let r = 0;
  let c = 0;
  for (let t = 0; t < k; t++) {
    [v, r, c] = h.pop();
    if (c + 1 < n) h.push([grid[r][c + 1], r, c + 1]);
  }
  return v;
}
