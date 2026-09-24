function solution(commands) {
  const line = [];
  let head = 0;
  const answer = [];
  for (const command of commands) {
    const [name, value] = command.split(" ");
    if (name === "enqueue") line.push(Number(value));
    else if (name === "dequeue") {
      if (head < line.length) head += 1;
    } else if (name === "front") answer.push(head < line.length ? line[head] : -1);
    else answer.push(head < line.length ? line[line.length - 1] : -1);
  }
  return answer;
}
