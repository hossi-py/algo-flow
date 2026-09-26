function solution(greed, cookies) {
  const g = [...greed].sort((a, b) => a - b);
  const c = [...cookies].sort((a, b) => a - b);
  let i = 0;
  for (const size of c) {
    if (i < g.length && size >= g[i]) i++;
  }
  return i;
}
