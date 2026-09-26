function solution(cards) {
  const s = cards.map(String);
  s.sort((a, b) => {
    if (a + b > b + a) return -1;
    if (a + b < b + a) return 1;
    return 0;
  });
  const r = s.join("");
  return r[0] === "0" ? "0" : r;
}
