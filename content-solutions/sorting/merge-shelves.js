function solution(a, b) {
  let i = 0;
  let j = 0;
  const out = [];
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) out.push(a[i++]);
    else out.push(b[j++]);
  }
  return out.concat(a.slice(i), b.slice(j));
}
