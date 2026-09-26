function solution(commands) {
  let [top, bottom, north, south, east, west] = [1, 6, 2, 5, 3, 4];
  let total = 0;
  for (const ch of commands) {
    if (ch === "E") [top, east, bottom, west] = [west, top, east, bottom];
    else if (ch === "W") [top, west, bottom, east] = [east, top, west, bottom];
    else if (ch === "N") [top, north, bottom, south] = [south, top, north, bottom];
    else [top, south, bottom, north] = [north, top, south, bottom];
    total += top;
  }
  return total;
}
