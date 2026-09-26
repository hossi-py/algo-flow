function solution(fatigue) {
  const rows = fatigue.length;
  const cols = fatigue[0].length;
  const best = fatigue.map((row) => [...row]);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === 0 && c === 0) continue;
      const up = r > 0 ? best[r - 1][c] : Infinity;
      const left = c > 0 ? best[r][c - 1] : Infinity;
      best[r][c] += Math.min(up, left);
    }
  }
  return best[rows - 1][cols - 1];
}
