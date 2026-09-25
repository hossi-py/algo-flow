function solution(n) {
  const answer = [];
  function echo(k) {
    if (k === 0) return;
    answer.push(k);
    echo(k - 1);
    answer.push(k);
  }
  echo(n);
  return answer;
}
