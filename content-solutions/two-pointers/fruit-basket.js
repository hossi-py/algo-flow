function solution(trees, k) {
  let l = 0;
  const count = new Map();
  let best = 0;
  for (let r = 0; r < trees.length; r++) {
    count.set(trees[r], (count.get(trees[r]) ?? 0) + 1);
    while (count.size > k) {
      const left = trees[l];
      count.set(left, count.get(left) - 1);
      if (count.get(left) === 0) count.delete(left);
      l++;
    }
    best = Math.max(best, r - l + 1);
  }
  return best;
}
