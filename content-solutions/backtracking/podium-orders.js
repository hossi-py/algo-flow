function solution(names, k) {
  const answer = [];
  const path = [];
  const used = new Array(names.length).fill(false);
  function pick() {
    if (path.length === k) {
      answer.push([...path]);
      return;
    }
    names.forEach((name, i) => {
      if (used[i]) return;
      used[i] = true;
      path.push(name);
      pick();
      path.pop();
      used[i] = false;
    });
  }
  pick();
  return answer;
}
