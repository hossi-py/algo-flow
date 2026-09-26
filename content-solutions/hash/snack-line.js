function solution(shelf) {
  const last = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < shelf.length; right++) {
    const c = shelf[right];
    if (last.has(c) && last.get(c) >= left) left = last.get(c) + 1;
    last.set(c, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
