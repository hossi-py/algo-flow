function solution(boss) {
  const n = boss.length;
  const children = Array.from({ length: n }, () => []);
  let root = 0;
  boss.forEach((b, i) => {
    if (b === -1) root = i;
    else children[b].push(i);
  });
  const level = new Array(n).fill(0);
  const queue = [root];
  for (let head = 0; head < queue.length; head++) {
    const u = queue[head];
    for (const c of children[u]) {
      level[c] = level[u] + 1;
      queue.push(c);
    }
  }
  return level;
}
