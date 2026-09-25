import java.util.*;

class Solution {
    public String solution(String path) {
        // 아래(맨 위 폴더)부터 이어 붙여야 해서 ArrayList를 스택처럼 쓴다
        List<String> stack = new ArrayList<>();
        for (String part : path.split("/")) {
            if (part.isEmpty() || part.equals(".")) continue;
            if (part.equals("..")) {
                if (!stack.isEmpty()) stack.remove(stack.size() - 1);
            } else {
                stack.add(part);
            }
        }
        return "/" + String.join("/", stack);
    }
}
