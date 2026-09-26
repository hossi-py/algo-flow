function solution(balloons) {
  let arrow = -Infinity;
  let count = 0;
  for (const [l, r] of [...balloons].sort((a, b) => a[1] - b[1])) {
    if (l > arrow) {
      count++;
      arrow = r;
    }
  }
  return count;
}
