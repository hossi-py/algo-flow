function solution(time, minutes) {
  const [h, m] = time.split(":").map(Number);
  const total = (h * 60 + m + minutes) % 1440;
  const hh = String(Math.floor(total / 60)).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}
