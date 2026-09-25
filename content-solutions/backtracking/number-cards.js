function solution(cards, k) {
  const n = cards.length;
  const used = new Array(n).fill(false);
  const path = [];
  const made = new Set();
  function arrange() {
    if (path.length === k) {
      if (path[0] !== 0) made.add(path.join(""));
      return;
    }
    for (let i = 0; i < n; i += 1) {
      if (!used[i]) {
        used[i] = true;
        path.push(cards[i]);
        arrange();
        path.pop();
        used[i] = false;
      }
    }
  }
  arrange();
  return made.size;
}
