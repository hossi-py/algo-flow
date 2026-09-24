function solution(n, k) {
  const circle = Array.from({ length: n }, (_, i) => i + 1);
  let head = 0;
  const out = [];
  while (circle.length - head > 0) {
    for (let i = 0; i < k - 1; i += 1) circle.push(circle[head++]);
    out.push(circle[head++]);
  }
  return out;
}
