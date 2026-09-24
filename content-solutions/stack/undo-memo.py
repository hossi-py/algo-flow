def solution(commands):
    text = ""
    history = []
    for command in commands:
        parts = command.split()
        name = parts[0]
        if name == "type":
            history.append(text)
            text += parts[1]
        elif name == "delete":
            history.append(text)
            text = text[: max(0, len(text) - int(parts[1]))]
        elif history:
            text = history.pop()
    return text
