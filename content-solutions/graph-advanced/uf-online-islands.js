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

function solution(rows, cols, positions) {
  const dsu = new DSU(rows * cols);
  const land = Array.from({ length: rows }, () => new Array(cols).fill(false));
  let count = 0;
  const answer = [];
  for (const [r, c] of positions) {
    if (!land[r][c]) {
      land[r][c] = true;
      count++;
      for (const [nr, nc] of [
        [r + 1, c],
        [r - 1, c],
        [r, c + 1],
        [r, c - 1],
      ]) {
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || !land[nr][nc]) continue;
        if (dsu.union(r * cols + c, nr * cols + nc)) count--;
      }
    }
    answer.push(count);
  }
  return answer;
}
