function solution(word, letter) {
  let i = 0;
  for (const c of letter) {
    if (i < word.length && c === word[i]) i++;
  }
  return i === word.length;
}
