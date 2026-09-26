function solution(cards) {
  function sortCount(a) {
    if (a.length <= 1) return [a, 0];
    const mid = a.length >> 1;
    const [left, x] = sortCount(a.slice(0, mid));
    const [right, y] = sortCount(a.slice(mid));
    const merged = [];
    let count = x + y;
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) merged.push(left[i++]);
      else {
        merged.push(right[j++]);
        count += left.length - i;
      }
    }
    while (i < left.length) merged.push(left[i++]);
    while (j < right.length) merged.push(right[j++]);
    return [merged, count];
  }
  return sortCount(cards)[1];
}
