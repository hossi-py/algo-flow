function solution(ribbon) {
  const s = ribbon;
  const n = s.length;
  const pal = Array.from({ length: n }, () => Array(n).fill(false));
  const cuts = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    cuts[j] = j;
    for (let i = 0; i <= j; i++) {
      if (s[i] === s[j] && (j - i < 2 || pal[i + 1][j - 1])) {
        pal[i][j] = true;
        cuts[j] = i === 0 ? 0 : Math.min(cuts[j], cuts[i - 1] + 1);
      }
    }
  }
  return cuts[n - 1];
}
