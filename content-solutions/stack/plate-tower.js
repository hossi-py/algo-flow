function solution(commands) {
  const stack = [];
  for (const command of commands) {
    const [name, value] = command.split(" ");
    if (name === "push") stack.push(Number(value));
    else if (stack.length > 0) stack.pop();
  }
  return stack;
}
