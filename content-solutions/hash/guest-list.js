function solution(invited, arrivals) {
  const invitedSet = new Set(invited);
  const answer = [];
  for (const name of arrivals) {
    answer.push(invitedSet.has(name));
  }
  return answer;
}
