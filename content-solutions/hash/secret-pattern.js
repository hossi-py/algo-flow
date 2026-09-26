function solution(pattern, words) {
  if (pattern.length !== words.length) return false;
  const toWord = new Map();
  const toChar = new Map();
  for (let i = 0; i < words.length; i++) {
    const c = pattern[i];
    const w = words[i];
    if (toWord.has(c) && toWord.get(c) !== w) return false;
    if (toChar.has(w) && toChar.get(w) !== c) return false;
    toWord.set(c, w);
    toChar.set(w, c);
  }
  return true;
}
