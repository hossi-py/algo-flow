function solution(room, r, c, d) {
  const rows = room.length;
  const cols = room[0].length;
  const dr = [-1, 0, 1, 0];
  const dc = [0, 1, 0, -1];
  const cleaned = Array.from({ length: rows }, () => new Array(cols).fill(false));
  let count = 0;
  for (;;) {
    if (!cleaned[r][c]) {
      cleaned[r][c] = true;
      count++;
    }
    let dirty = false;
    for (let k = 0; k < 4; k++) {
      const nr = r + dr[k];
      const nc = c + dc[k];
      if (room[nr][nc] === "." && !cleaned[nr][nc]) dirty = true;
    }
    if (!dirty) {
      const br = r - dr[d];
      const bc = c - dc[d];
      if (room[br][bc] === "#") break;
      [r, c] = [br, bc];
    } else {
      d = (d + 3) % 4;
      const fr = r + dr[d];
      const fc = c + dc[d];
      if (room[fr][fc] === "." && !cleaned[fr][fc]) [r, c] = [fr, fc];
    }
  }
  return count;
}
