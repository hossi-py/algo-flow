function solution(dishes, q) {
  const line = dishes.map(([name, time]) => [name, time]);
  let head = 0;
  const done = [];
  while (head < line.length) {
    const [name, left] = line[head++];
    if (left - q <= 0) done.push(name);
    else line.push([name, left - q]);
  }
  return done;
}
