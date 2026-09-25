function solution(n) {
  const answer = [];
  const path = [];
  function climb(remain) {
    if (remain === 0) {
      answer.push([...path]);
      return;
    }
    for (const step of [1, 2]) {
      if (step <= remain) {
        path.push(step);
        climb(remain - step);
        path.pop();
      }
    }
  }
  climb(n);
  return answer;
}
