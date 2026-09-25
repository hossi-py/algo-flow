function solution(n, follows) {
  const followers = Array.from({ length: n }, () => []);
  for (const [a, b] of follows) followers[b].push(a);
  for (const f of followers) f.sort((x, y) => x - y);
  return followers;
}
