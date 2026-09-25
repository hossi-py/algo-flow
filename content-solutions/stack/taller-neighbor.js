function solution(heights) {
  const answer = new Array(heights.length).fill(0);
  const stack = [];
  heights.forEach((h, i) => {
    while (stack.length > 0 && heights[stack[stack.length - 1]] <= h) stack.pop();
    answer[i] = stack.length > 0 ? stack[stack.length - 1] + 1 : 0;
    stack.push(i);
  });
  return answer;
}
