function solution(events) {
  const line = [];
  let head = 0;
  const served = [];
  for (const event of events) {
    const [name, who] = event.split(" ");
    if (name === "arrive") line.push(who);
    else if (head < line.length) served.push(line[head++]);
  }
  return served;
}
