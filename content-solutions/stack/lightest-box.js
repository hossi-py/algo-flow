function solution(commands) {
  const stack = [];
  const mins = [];
  const answer = [];
  for (const command of commands) {
    const [name, value] = command.split(" ");
    if (name === "push") {
      const w = Number(value);
      stack.push(w);
      mins.push(mins.length === 0 ? w : Math.min(w, mins[mins.length - 1]));
    } else if (name === "pop") {
      if (stack.length > 0) {
        stack.pop();
        mins.pop();
      }
    } else {
      answer.push(mins.length > 0 ? mins[mins.length - 1] : -1);
    }
  }
  return answer;
}
