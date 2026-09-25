function solution(s) {
  const answer = new Array(s.length).fill(-1);
  const stack = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") {
      stack.push(i);
    } else if (s[i] === ")") {
      const j = stack.pop();
      answer[i] = j;
      answer[j] = i;
    }
  }
  return answer;
}
