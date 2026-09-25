function solution(heights) {
  function count(a) {
    if (a.length <= 1) return [a, 0];
    const mid = Math.floor(a.length / 2);
    const [left, x] = count(a.slice(0, mid));
    const [right, y] = count(a.slice(mid));
    const merged = [];
    let swaps = x + y;
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) merged.push(left[i++]);
      else {
        merged.push(right[j++]);
        swaps += left.length - i;
      }
    }
    while (i < left.length) merged.push(left[i++]);
    while (j < right.length) merged.push(right[j++]);
    return [merged, swaps];
  }
  return count(heights)[1];
}
