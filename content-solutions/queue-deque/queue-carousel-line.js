function solution(commands) {
  const line = [];
  let head = 0;
  const answer = [];
  for (const command of commands) {
    const [name, value] = command.split(" ");
    if (name === "arrive") {
      line.push(value);
    } else {
      const group = [];
      const count = Math.min(Number(value), line.length - head);
      for (let i = 0; i < count; i++) group.push(line[head++]);
      answer.push(group);
    }
  }
  return answer;
}
