function solution(records, fees) {
  const [baseTime, baseFee, unitTime, unitFee] = fees;
  const start = new Map();
  const total = new Map();
  for (const rec of records) {
    const [t, num, kind] = rec.split(" ");
    const [h, m] = t.split(":").map(Number);
    const minute = h * 60 + m;
    if (kind === "OUT") {
      start.set(num, minute);
      if (!total.has(num)) total.set(num, 0);
    } else {
      total.set(num, total.get(num) + minute - start.get(num));
      start.delete(num);
    }
  }
  for (const [num, s] of start) total.set(num, total.get(num) + 1439 - s);
  return [...total.keys()].sort().map((num) => {
    const t = total.get(num);
    if (t <= baseTime) return baseFee;
    return baseFee + Math.ceil((t - baseTime) / unitTime) * unitFee;
  });
}
