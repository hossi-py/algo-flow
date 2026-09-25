function solution(routes) {
  const n = routes.length;
  const answer = routes.map(() => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < n; k++) {
      if (!routes[i][k]) continue;
      for (let j = 0; j < n; j++) {
        if (routes[k][j]) answer[i][j] = 1;
      }
    }
  }
  return answer;
}
