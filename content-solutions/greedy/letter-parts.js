function solution(s) {
  const last = new Map();
  for (let i = 0; i < s.length; i++) last.set(s[i], i);
  const parts = [];
  let start = 0;
  let end = 0;
  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, last.get(s[i]));
    if (i === end) {
      parts.push(end - start + 1);
      start = i + 1;
    }
  }
  return parts;
}
