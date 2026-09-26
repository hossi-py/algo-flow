function solution(note) {
  const ok = (c) => /[a-z0-9]/i.test(c);
  let l = 0;
  let r = note.length - 1;
  while (l < r) {
    if (!ok(note[l])) l++;
    else if (!ok(note[r])) r--;
    else if (note[l].toLowerCase() !== note[r].toLowerCase()) return false;
    else {
      l++;
      r--;
    }
  }
  return true;
}
