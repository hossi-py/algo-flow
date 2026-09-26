function solution(n) {
  if (n < 2) return "NO";
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return "NO";
  }
  return "YES";
}
