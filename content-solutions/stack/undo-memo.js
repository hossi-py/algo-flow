function solution(commands) {
  let text = "";
  const history = [];
  for (const command of commands) {
    const [name, arg] = command.split(" ");
    if (name === "type") {
      history.push(text);
      text += arg;
    } else if (name === "delete") {
      history.push(text);
      text = text.slice(0, Math.max(0, text.length - Number(arg)));
    } else if (history.length > 0) {
      text = history.pop();
    }
  }
  return text;
}
