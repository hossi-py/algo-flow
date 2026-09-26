function solution(bookings) {
  const sorted = [...bookings].sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const [s, e] of sorted) {
    const last = out[out.length - 1];
    if (last && last[1] >= s) last[1] = Math.max(last[1], e);
    else out.push([s, e]);
  }
  return out;
}
