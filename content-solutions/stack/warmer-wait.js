function solution(temps) {
  const answer = new Array(temps.length).fill(0);
  const stack = [];
  temps.forEach((temp, today) => {
    while (stack.length > 0 && temps[stack[stack.length - 1]] < temp) {
      const day = stack.pop();
      answer[day] = today - day;
    }
    stack.push(today);
  });
  return answer;
}
