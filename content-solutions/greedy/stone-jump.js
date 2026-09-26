function solution(jumps) {
  let far = 0;
  for (let i = 0; i < jumps.length; i++) {
    if (i > far) return false;
    far = Math.max(far, i + jumps[i]);
  }
  return true;
}
