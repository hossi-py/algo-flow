function solution(commands) {
  const stack = [];
  const answer = [];
  for (const command of commands) {
    const [name, value] = command.split(" ");
    if (name === "push") stack.push(Number(value));
    else if (name === "pop") {
      if (stack.length > 0) stack.pop();
    } else answer.push(stack.length > 0 ? stack[stack.length - 1] : -1);
  }
  return answer;
}
