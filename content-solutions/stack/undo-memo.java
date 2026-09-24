import java.util.*;

class Solution {
    public String solution(String[] commands) {
        String text = "";
        Deque<String> history = new ArrayDeque<>();
        for (String command : commands) {
            String[] parts = command.split(" ");
            if (parts[0].equals("type")) {
                history.push(text);
                text += parts[1];
            } else if (parts[0].equals("delete")) {
                history.push(text);
                text = text.substring(0, Math.max(0, text.length() - Integer.parseInt(parts[1])));
            } else if (!history.isEmpty()) {
                text = history.pop();
            }
        }
        return text;
    }
}
