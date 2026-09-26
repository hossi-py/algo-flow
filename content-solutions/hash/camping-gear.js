function solution(kinds) {
  const count = new Map();
  for (const kind of kinds) count.set(kind, (count.get(kind) ?? 0) + 1);
  let ways = 1;
  for (const c of count.values()) {
    ways *= c + 1;
  }
  return ways - 1;
}
