function solution(leap) {
  const n = leap.length;
  const dist = new Array(n).fill(-1);
  dist[0] = 0;
  const queue = [0];
  let head = 0;
  while (head < queue.length) {
    const i = queue[head++];
    for (const j of [i + leap[i], i - leap[i]]) {
      if (j >= 0 && j < n && dist[j] === -1) {
        dist[j] = dist[i] + 1;
        queue.push(j);
      }
    }
  }
  return dist[n - 1];
}
