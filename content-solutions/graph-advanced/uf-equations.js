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

function solution(equations) {
  const dsu = new DSU(26);
  const idx = (ch) => ch.charCodeAt(0) - 97;
  for (const e of equations) {
    if (e[1] === "=") dsu.union(idx(e[0]), idx(e[3]));
  }
  for (const e of equations) {
    if (e[1] === "!" && dsu.find(idx(e[0])) === dsu.find(idx(e[3]))) return "NO";
  }
  return "YES";
}
