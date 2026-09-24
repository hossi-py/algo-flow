function solution(keys) {
  const stack = [];
  for (const key of keys) {
    if (key === "<") {
      if (stack.length > 0) stack.pop();
    } else {
      stack.push(key);
    }
  }
  return stack.join("");
}
