function solution(code) {
  const pair = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const c of code) {
    if ("([{".includes(c)) stack.push(c);
    else if (stack.length === 0 || stack.pop() !== pair[c]) return false;
  }
  return stack.length === 0;
}
