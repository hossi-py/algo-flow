function solution(heights) {
  const h = [...heights, 0];
  const stack = [];
  let best = 0;
  for (let i = 0; i < h.length; i++) {
    while (stack.length > 0 && h[stack[stack.length - 1]] >= h[i]) {
      const top = stack.pop();
      const left = stack.length > 0 ? stack[stack.length - 1] + 1 : 0;
      best = Math.max(best, h[top] * (i - left));
    }
    stack.push(i);
  }
  return best;
}
