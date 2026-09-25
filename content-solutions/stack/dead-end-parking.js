function solution(commands) {
  const lane = [];
  const answer = [];
  for (const command of commands) {
    const [name, value] = command.split(" ");
    if (name === "in") lane.push(Number(value));
    else if (lane.length > 0) answer.push(lane.pop());
  }
  while (lane.length > 0) answer.push(lane.pop());
  return answer;
}
