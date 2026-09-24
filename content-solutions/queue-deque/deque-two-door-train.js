function solution(commands) {
  const size = commands.length;
  const slots = new Array(2 * size + 1);
  let head = size;
  let tail = size;
  for (const command of commands) {
    const [name, value] = command.split(" ");
    if (name === "push_front") slots[--head] = Number(value);
    else if (name === "push_back") slots[tail++] = Number(value);
    else if (name === "pop_front") {
      if (head < tail) head += 1;
    } else if (head < tail) tail -= 1;
  }
  return slots.slice(head, tail);
}
