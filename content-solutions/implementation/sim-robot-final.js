function solution(commands) {
  let x = 0;
  let y = 0;
  for (const ch of commands) {
    if (ch === "U") y++;
    else if (ch === "D") y--;
    else if (ch === "L") x--;
    else x++;
  }
  return [x, y];
}
