function solution(values, target) {
  const sorted = [...values].sort((a, b) => a - b);
  const answer = [];
  const path = [];
  function pick(start, remain) {
    if (remain === 0) {
      answer.push([...path]);
      return;
    }
    for (let i = start; i < sorted.length && sorted[i] <= remain; i++) {
      path.push(sorted[i]);
      pick(i, remain - sorted[i]);
      path.pop();
    }
  }
  pick(0, target);
  return answer;
}
