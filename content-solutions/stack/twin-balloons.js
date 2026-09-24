function solution(balloons) {
  const stack = [];
  for (const c of balloons) {
    if (stack.length > 0 && stack[stack.length - 1] === c) stack.pop();
    else stack.push(c);
  }
  return stack.join("");
}
