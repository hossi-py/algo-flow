function solution(n, pairs) {
  const friends = Array.from({ length: n }, () => new Set());
  for (const [a, b] of pairs) {
    friends[a].add(b);
    friends[b].add(a);
  }
  let count = 0;
  for (const [a, b] of pairs) {
    const [small, large] = friends[a].size < friends[b].size ? [friends[a], friends[b]] : [friends[b], friends[a]];
    for (const c of small) if (large.has(c)) count++;
  }
  return count / 3;
}
