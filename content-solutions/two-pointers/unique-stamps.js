function solution(stamps) {
  const result = [stamps[0]];
  for (let i = 1; i < stamps.length; i++) {
    if (stamps[i] !== result[result.length - 1]) result.push(stamps[i]);
  }
  return result;
}
