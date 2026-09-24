import java.util.*;

class Solution {
    public String solution(String keys) {
        // StringBuilder의 끝을 스택의 꼭대기로 쓴다
        StringBuilder stack = new StringBuilder();
        for (char key : keys.toCharArray()) {
            if (key == '<') {
                if (stack.length() > 0) stack.deleteCharAt(stack.length() - 1);
            } else {
                stack.append(key);
            }
        }
        return stack.toString();
    }
}
