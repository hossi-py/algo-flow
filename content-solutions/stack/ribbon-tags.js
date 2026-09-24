function solution(tags) {
  const stack = [];
  for (const tag of tags) {
    const closing = tag[1] === "/";
    const name = closing ? tag.slice(2, -1) : tag.slice(1, -1);
    if (closing) {
      if (stack.length === 0 || stack.pop() !== name) return false;
    } else {
      stack.push(name);
    }
  }
  return stack.length === 0;
}
