import java.util.*;

class Solution {
    public List<Integer> solution(int[] stamps) {
        List<Integer> answer = new ArrayList<>();
        answer.add(stamps[0]);
        for (int i = 1; i < stamps.length; i++) {
            if (stamps[i] != answer.get(answer.size() - 1)) answer.add(stamps[i]);
        }
        return answer;
    }
}
