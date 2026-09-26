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

function solution(n, bridges, cuts) {
  const dsu = new DSU(n);
  const cut = new Set(cuts);
  let groups = n;
  bridges.forEach(([a, b], i) => {
    if (!cut.has(i) && dsu.union(a, b)) groups--;
  });
  const answer = [];
  for (let k = cuts.length - 1; k >= 0; k--) {
    answer.push(groups);
    const [a, b] = bridges[cuts[k]];
    if (dsu.union(a, b)) groups--;
  }
  return answer.reverse();
}
