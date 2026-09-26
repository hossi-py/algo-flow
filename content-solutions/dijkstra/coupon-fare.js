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

function solution(n, roads) {
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b, t] of roads) {
    graph[a].push([b, t]);
    graph[b].push([a, t]);
  }
  const dist = Array.from({ length: n }, () => [Infinity, Infinity]);
  dist[0][0] = 0;
  const heap = new Heap((a, b) => a[0] < b[0]);
  heap.push([0, 0, 0]);
  const relax = (nd, w, used) => {
    if (nd < dist[w][used]) {
      dist[w][used] = nd;
      heap.push([nd, w, used]);
    }
  };
  while (heap.size > 0) {
    const [d, v, used] = heap.pop();
    if (d > dist[v][used]) continue;
    for (const [w, c] of graph[v]) {
      relax(d + c, w, used);
      if (used === 0) relax(d + Math.floor(c / 2), w, 1);
    }
  }
  const best = Math.min(dist[n - 1][0], dist[n - 1][1]);
  return best === Infinity ? -1 : best;
}
