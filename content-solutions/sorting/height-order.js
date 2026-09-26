function solution(heights) {
  const order = heights.map((_, i) => i);
  order.sort((a, b) => heights[a] - heights[b] || a - b);
  return order;
}
