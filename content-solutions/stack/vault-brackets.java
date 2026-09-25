import java.util.*;

class Solution {
    public boolean solution(String code) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : code.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);
                continue;
            }
            char open = c == ')' ? '(' : c == ']' ? '[' : '{';
            if (stack.isEmpty() || stack.pop() != open) return false;
        }
        return stack.isEmpty();
    }
}
