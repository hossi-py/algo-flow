function solution(letters, message) {
  const have = new Map();
  for (const ch of letters) have.set(ch, (have.get(ch) ?? 0) + 1);
  for (const ch of message) {
    if (!have.get(ch)) return false;
    have.set(ch, have.get(ch) - 1);
  }
  return true;
}
