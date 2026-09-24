function solution(garden) {
  const count = [0, 0];
  function same(r, c, size) {
    const first = garden[r][c];
    for (let y = r; y < r + size; y += 1) {
      for (let x = c; x < c + size; x += 1) if (garden[y][x] !== first) return false;
    }
    return true;
  }
  function compress(r, c, size) {
    if (same(r, c, size)) {
      count[Number(garden[r][c])] += 1;
      return;
    }
    const half = size / 2;
    compress(r, c, half);
    compress(r, c + half, half);
    compress(r + half, c, half);
    compress(r + half, c + half, half);
  }
  compress(0, 0, garden.length);
  return count;
}
