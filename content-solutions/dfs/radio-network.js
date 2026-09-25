function solution(link) {
  const n = link.length;
  const visited = new Array(n).fill(false);
  function dfs(v) {
    visited[v] = true;
    let size = 1;
    for (let w = 0; w < n; w += 1) {
      if (link[v][w] === 1 && !visited[w]) size += dfs(w);
    }
    return size;
  }
  let groups = 0;
  let largest = 0;
  for (let v = 0; v < n; v += 1) {
    if (!visited[v]) {
      groups += 1;
      largest = Math.max(largest, dfs(v));
    }
  }
  return [groups, largest];
}
