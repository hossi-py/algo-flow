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

function solution(n, prereqs) {
  const graph = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);
  for (const [a, b] of prereqs) {
    graph[a].push(b);
    indeg[b]++;
  }
  const heap = new Heap((a, b) => a < b);
  for (let v = 0; v < n; v++) if (indeg[v] === 0) heap.push(v);
  const order = [];
  while (heap.size > 0) {
    const v = heap.pop();
    order.push(v);
    for (const w of graph[v]) {
      indeg[w]--;
      if (indeg[w] === 0) heap.push(w);
    }
  }
  return order.length === n ? order : [];
}
