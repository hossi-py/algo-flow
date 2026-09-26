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

function solution(n, flights, src, dst, k) {
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b, p] of flights) graph[a].push([b, p]);
  const dist = Array.from({ length: n }, () => new Array(k + 2).fill(Infinity));
  dist[src][0] = 0;
  const heap = new Heap((x, y) => x[0] < y[0]);
  heap.push([0, src, 0]);
  while (heap.size > 0) {
    const [cost, v, used] = heap.pop();
    if (v === dst) return cost;
    if (cost > dist[v][used] || used === k + 1) continue;
    for (const [w, p] of graph[v]) {
      const nc = cost + p;
      if (nc < dist[w][used + 1]) {
        dist[w][used + 1] = nc;
        heap.push([nc, w, used + 1]);
      }
    }
  }
  return -1;
}
