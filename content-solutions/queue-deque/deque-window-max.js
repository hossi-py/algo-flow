function solution(temps, k) {
  const dq = new Array(temps.length);
  let head = 0;
  let tail = 0;
  const answer = [];
  temps.forEach((t, i) => {
    while (tail > head && temps[dq[tail - 1]] <= t) tail -= 1;
    dq[tail++] = i;
    if (dq[head] <= i - k) head += 1;
    if (i >= k - 1) answer.push(temps[dq[head]]);
  });
  return answer;
}
