function solution(queries) {
  return queries.map(([a, b]) => ((a + b) * (b - a + 1)) / 2);
}
