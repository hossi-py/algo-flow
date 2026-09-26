function solution(n, stickers) {
  const have = new Set(stickers);
  const answer = [];
  for (let k = 1; k <= n; k++) {
    if (!have.has(k)) answer.push(k);
  }
  return answer;
}
