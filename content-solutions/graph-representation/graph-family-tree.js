function solution(parent) {
  const children = parent.map(() => []);
  parent.forEach((p, i) => {
    if (p !== -1) children[p].push(i);
  });
  return children;
}
