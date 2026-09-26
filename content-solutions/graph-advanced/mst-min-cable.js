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

function solution(n, cables) {
  const dsu = new DSU(n);
  let total = 0;
  let picked = 0;
  for (const [a, b, c] of [...cables].sort((x, y) => x[2] - y[2])) {
    if (dsu.union(a, b)) {
      total += c;
      picked++;
    }
  }
  return picked === n - 1 ? total : -1;
}
