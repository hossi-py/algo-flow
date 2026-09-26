function solution(number, k) {
  const stack = [];
  for (const d of number) {
    while (k > 0 && stack.length && stack[stack.length - 1] < d) {
      stack.pop();
      k--;
    }
    stack.push(d);
  }
  stack.length -= k;
  return stack.join("");
}
