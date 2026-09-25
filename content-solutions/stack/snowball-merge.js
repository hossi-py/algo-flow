function solution(sizes) {
  const stack = [];
  for (let ball of sizes) {
    while (stack.length > 0 && stack[stack.length - 1] === ball) {
      stack.pop();
      ball *= 2;
    }
    stack.push(ball);
  }
  return stack;
}
