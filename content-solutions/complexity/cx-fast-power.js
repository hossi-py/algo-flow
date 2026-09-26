function solution(a, b, m) {
  let result = 1 % m;
  let base = a % m;
  while (b > 0) {
    if (b % 2 === 1) result = (result * base) % m;
    base = (base * base) % m;
    b = Math.floor(b / 2);
  }
  return result;
}
