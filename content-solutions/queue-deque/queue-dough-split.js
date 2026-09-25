function solution(doughs, limit) {
  const line = [...doughs];
  let head = 0;
  const answer = [];
  while (head < line.length) {
    const w = line[head++];
    if (w <= limit) {
      answer.push(w);
    } else {
      const half = Math.floor(w / 2);
      line.push(half, w - half);
    }
  }
  return answer;
}
