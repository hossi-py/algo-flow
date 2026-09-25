import java.util.*;

class Solution {
    public boolean solution(String[] tags) {
        Deque<String> stack = new ArrayDeque<>();
        for (String tag : tags) {
            boolean closing = tag.charAt(1) == '/';
            String name = closing ? tag.substring(2, tag.length() - 1) : tag.substring(1, tag.length() - 1);
            if (closing) {
                if (stack.isEmpty() || !stack.pop().equals(name)) return false;
            } else {
                stack.push(name);
            }
        }
        return stack.isEmpty();
    }
}
