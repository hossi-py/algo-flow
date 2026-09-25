function solution(signal, limit) {
  const n = signal.length;
  const maxq = new Array(n);
  const minq = new Array(n);
  let maxHead = 0,
    maxTail = 0,
    minHead = 0,
    minTail = 0;
  let left = 0;
  let best = 0;
  for (let right = 0; right < n; right += 1) {
    const value = signal[right];
    while (maxTail > maxHead && signal[maxq[maxTail - 1]] <= value) maxTail -= 1;
    maxq[maxTail++] = right;
    while (minTail > minHead && signal[minq[minTail - 1]] >= value) minTail -= 1;
    minq[minTail++] = right;
    while (signal[maxq[maxHead]] - signal[minq[minHead]] > limit) {
      left += 1;
      if (maxq[maxHead] < left) maxHead += 1;
      if (minq[minHead] < left) minHead += 1;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}
