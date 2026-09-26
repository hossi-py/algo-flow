function solution(jumps) {
  let count = 0;
  let end = 0;
  let far = 0;
  for (let i = 0; i < jumps.length - 1; i++) {
    far = Math.max(far, i + jumps[i]);
    if (i === end) {
      count++;
      end = far;
    }
  }
  return count;
}
