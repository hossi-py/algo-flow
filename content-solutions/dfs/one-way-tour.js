function solution(n, roads, start) {
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b] of roads) graph[a].push(b);
  const visited = new Array(n).fill(false);
  visited[start] = true;
  const stack = [start];
  while (stack.length > 0) {
    const u = stack.pop();
    for (const v of graph[u]) {
      if (!visited[v]) {
        visited[v] = true;
        stack.push(v);
      }
    }
  }
  const answer = [];
  for (let i = 0; i < n; i++) if (visited[i] && i !== start) answer.push(i);
  return answer;
}
