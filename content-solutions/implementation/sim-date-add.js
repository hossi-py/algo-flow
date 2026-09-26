function solution(date, days) {
  const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const monthDays = (y, m) => (m === 2 ? (isLeap(y) ? 29 : 28) : [4, 6, 9, 11].includes(m) ? 30 : 31);
  let [y, m, d] = date.split("-").map(Number);
  let day = d - 1 + days;
  for (let k = 1; k < m; k++) day += monthDays(y, k);
  while (day >= (isLeap(y) ? 366 : 365)) {
    day -= isLeap(y) ? 366 : 365;
    y++;
  }
  m = 1;
  while (day >= monthDays(y, m)) {
    day -= monthDays(y, m);
    m++;
  }
  const pad = (v, w) => String(v).padStart(w, "0");
  return `${pad(y, 4)}-${pad(m, 2)}-${pad(day + 1, 2)}`;
}
