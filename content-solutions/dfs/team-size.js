function solution(boss) {
  const n = boss.length;
  const children = Array.from({ length: n }, () => []);
  let root = 0;
  boss.forEach((b, i) => {
    if (b === -1) root = i;
    else children[b].push(i);
  });
  const sizes = new Array(n).fill(0);
  function dfs(v) {
    let total = 1;
    for (const w of children[v]) total += dfs(w);
    sizes[v] = total;
    return total;
  }
  dfs(root);
  return sizes;
}
