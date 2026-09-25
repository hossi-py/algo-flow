function solution(a, b, m) {
  function power(e) {
    if (e === 0) return 1 % m;
    const half = power(Math.floor(e / 2));
    let result = (half * half) % m;
    if (e % 2 === 1) result = (result * a) % m;
    return result;
  }
  return power(b);
}
