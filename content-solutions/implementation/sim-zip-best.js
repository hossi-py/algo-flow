function solution(s) {
  const pieceLen = (chunk, cnt) => chunk.length + (cnt > 1 ? String(cnt).length : 0);
  let best = s.length;
  for (let k = 1; k <= s.length; k++) {
    const chunks = [];
    for (let i = 0; i < s.length; i += k) chunks.push(s.slice(i, i + k));
    let length = 0;
    let prev = chunks[0];
    let cnt = 1;
    for (let i = 1; i < chunks.length; i++) {
      if (chunks[i] === prev) cnt++;
      else {
        length += pieceLen(prev, cnt);
        prev = chunks[i];
        cnt = 1;
      }
    }
    length += pieceLen(prev, cnt);
    best = Math.min(best, length);
  }
  return best;
}
