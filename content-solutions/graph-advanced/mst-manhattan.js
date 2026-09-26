class DSU {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = new Array(n).fill(1);
  }
  find(x) {
    let root = x;
    while (this.parent[root] !== root) root = this.parent[root];
    while (x !== root) {
      const next = this.parent[x];
      this.parent[x] = root;
      x = next;
    }
    return root;
  }
  union(a, b) {
    let ra = this.find(a);
    let rb = this.find(b);
    if (ra === rb) return false;
    if (this.size[ra] < this.size[rb]) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;
    this.size[ra] += this.size[rb];
    return true;
  }
}

function solution(points) {
  const n = points.length;
  const edges = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d = Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]);
      edges.push([d, i, j]);
    }
  }
  edges.sort((a, b) => a[0] - b[0]);
  const dsu = new DSU(n);
  let total = 0;
  let picked = 0;
  for (const [d, i, j] of edges) {
    if (dsu.union(i, j)) {
      total += d;
      if (++picked === n - 1) break;
    }
  }
  return total;
}
