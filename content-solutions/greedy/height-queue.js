function solution(people) {
  const sorted = [...people].sort((a, b) => b[0] - a[0] || a[1] - b[1]);
  const line = [];
  for (const [h, k] of sorted) line.splice(k, 0, [h, k]);
  return line;
}
