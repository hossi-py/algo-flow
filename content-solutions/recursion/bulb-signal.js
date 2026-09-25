function solution(n) {
  function signal(k) {
    if (k < 2) return String(k);
    return signal(Math.floor(k / 2)) + String(k % 2);
  }
  return signal(n);
}
