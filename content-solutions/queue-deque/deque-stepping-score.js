function solution(scores, k) {
  const n = scores.length;
  const best = new Array(n).fill(0);
  best[0] = scores[0];
  const window = [0];
  let head = 0;
  for (let i = 1; i < n; i++) {
    while (window[head] < i - k) head++;
    best[i] = scores[i] + best[window[head]];
    while (window.length > head && best[window[window.length - 1]] <= best[i]) window.pop();
    window.push(i);
  }
  return best[n - 1];
}
