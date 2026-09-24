function solution(closet) {
  const result = [];
  const path = [];
  function choose(i) {
    if (i === closet.length) {
      result.push([...path]);
      return;
    }
    for (const item of closet[i]) {
      path.push(item);
      choose(i + 1);
      path.pop();
    }
  }
  choose(0);
  return result;
}
