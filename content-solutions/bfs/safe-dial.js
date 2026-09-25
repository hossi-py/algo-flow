function solution(target, jammed) {
  const blocked = new Set(jammed);
  if (blocked.has("0000")) return -1;
  const dist = new Map([["0000", 0]]);
  const queue = ["0000"];
  let head = 0;
  while (head < queue.length) {
    const s = queue[head++];
    if (s === target) return dist.get(s);
    for (let i = 0; i < 4; i += 1) {
      for (const d of [1, 9]) {
        const digit = (Number(s[i]) + d) % 10;
        const t = s.slice(0, i) + digit + s.slice(i + 1);
        if (!blocked.has(t) && !dist.has(t)) {
          dist.set(t, dist.get(s) + 1);
          queue.push(t);
        }
      }
    }
  }
  return -1;
}
