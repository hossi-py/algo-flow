function solution(names) {
  const seen = new Set();
  for (const name of names) {
    if (seen.has(name)) return name;
    seen.add(name);
  }
  return "";
}
