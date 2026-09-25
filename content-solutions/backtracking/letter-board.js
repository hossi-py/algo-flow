function solution(board, word) {
  const rows = board.length;
  const cols = board[0].length;
  const have = new Map();
  for (const row of board) for (const ch of row) have.set(ch, (have.get(ch) ?? 0) + 1);
  const need = new Map();
  for (const ch of word) need.set(ch, (need.get(ch) ?? 0) + 1);
  for (const [ch, cnt] of need) if ((have.get(ch) ?? 0) < cnt) return false;
  const used = Array.from({ length: rows }, () => new Array(cols).fill(false));
  function search(r, c, k) {
    if (board[r][c] !== word[k]) return false;
    if (k === word.length - 1) return true;
    used[r][c] = true;
    for (const [dr, dc] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !used[nr][nc] && search(nr, nc, k + 1)) {
        used[r][c] = false;
        return true;
      }
    }
    used[r][c] = false;
    return false;
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) if (search(r, c, 0)) return true;
  }
  return false;
}
