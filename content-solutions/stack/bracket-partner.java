import java.util.*;

class Solution {
    public int[] solution(String s) {
        int[] answer = new int[s.length()];
        Arrays.fill(answer, -1);
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            if (ch == '(') {
                stack.push(i);
            } else if (ch == ')') {
                int j = stack.pop();
                answer[i] = j;
                answer[j] = i;
            }
        }
        return answer;
    }
}
