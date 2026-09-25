function solution(times) {
  const window = [];
  let head = 0;
  const answer = [];
  for (const t of times) {
    window.push(t);
    while (window[head] < t - 3000) head += 1;
    answer.push(window.length - head);
  }
  return answer;
}
