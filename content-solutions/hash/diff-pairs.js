function solution(heights, k) {
  const count = new Map();
  let answer = 0;
  for (const x of heights) {
    if (k === 0) answer += count.get(x) ?? 0;
    else answer += (count.get(x - k) ?? 0) + (count.get(x + k) ?? 0);
    count.set(x, (count.get(x) ?? 0) + 1);
  }
  return answer;
}
