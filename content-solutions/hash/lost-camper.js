function solution(departed, returned) {
  const count = new Map();
  for (const name of departed) count.set(name, (count.get(name) ?? 0) + 1);
  for (const name of returned) count.set(name, count.get(name) - 1);
  for (const [name, c] of count) {
    if (c > 0) return name;
  }
  return "";
}
