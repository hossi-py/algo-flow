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

function dijkstra(graph, start) {
  const dist = new Array(graph.length).fill(Infinity);
  dist[start] = 0;
  const heap = new Heap((a, b) => a[0] < b[0]);
  heap.push([0, start]);
  while (heap.size > 0) {
    const [d, v] = heap.pop();
    if (d > dist[v]) continue;
    for (const [w, t] of graph[v]) {
      if (d + t < dist[w]) {
        dist[w] = d + t;
        heap.push([dist[w], w]);
      }
    }
  }
  return dist;
}

function solution(n, roads, limit) {
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b, t] of roads) {
    graph[a].push([b, t]);
    graph[b].push([a, t]);
  }
  const dist = dijkstra(graph, 0);
  return dist.filter((d) => d <= limit).length;
}
