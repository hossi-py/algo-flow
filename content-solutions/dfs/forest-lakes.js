function solution(forest) {
  const rows = forest.length;
  const cols = forest[0].length;
  const seen = Array.from({ length: rows }, () => new Array(cols).fill(false));
  function fill(r, c) {
    seen[r][c] = true;
    let touches = r === 0 || r === rows - 1 || c === 0 || c === cols - 1;
    for (const [dr, dc] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && forest[nr][nc] === "." && !seen[nr][nc]) {
        if (fill(nr, nc)) touches = true;
      }
    }
    return touches;
  }
  let lakes = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (forest[r][c] === "." && !seen[r][c] && !fill(r, c)) lakes++;
    }
  }
  return lakes;
}
