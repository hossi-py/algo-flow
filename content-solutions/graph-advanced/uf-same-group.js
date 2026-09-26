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

function solution(n, ops) {
  const dsu = new DSU(n);
  const answer = [];
  for (const [kind, a, b] of ops) {
    if (kind === 0) dsu.union(a, b);
    else answer.push(dsu.find(a) === dsu.find(b) ? "YES" : "NO");
  }
  return answer;
}
