function solution(commands) {
  const dx = [0, 1, 0, -1];
  const dy = [1, 0, -1, 0];
  let x = 0;
  let y = 0;
  let d = 0;
  for (const ch of commands) {
    if (ch === "L") d = (d + 3) % 4;
    else if (ch === "R") d = (d + 1) % 4;
    else {
      x += dx[d];
      y += dy[d];
    }
  }
  return [x, y];
}
