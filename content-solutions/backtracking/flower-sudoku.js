function solution(garden) {
  const grid = garden.map((row) => row.split(""));
  const blanks = [];
  for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) if (grid[r][c] === ".") blanks.push([r, c]);
  function fits(r, c, flower) {
    for (let i = 0; i < 6; i++) {
      if (grid[r][i] === flower || grid[i][c] === flower) return false;
    }
    const top = Math.floor(r / 2) * 2;
    const left = Math.floor(c / 3) * 3;
    for (let i = top; i < top + 2; i++) {
      for (let j = left; j < left + 3; j++) if (grid[i][j] === flower) return false;
    }
    return true;
  }
  function fill(k) {
    if (k === blanks.length) return true;
    const [r, c] = blanks[k];
    for (const flower of "123456") {
      if (fits(r, c, flower)) {
        grid[r][c] = flower;
        if (fill(k + 1)) return true;
        grid[r][c] = ".";
      }
    }
    return false;
  }
  fill(0);
  return grid.map((row) => row.join(""));
}
