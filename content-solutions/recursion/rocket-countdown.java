import java.util.*;

class Solution {
    public List<Integer> solution(int n) {
        if (n == 1) return new ArrayList<>(List.of(1));
        List<Integer> answer = new ArrayList<>();
        answer.add(n);
        answer.addAll(solution(n - 1));
        return answer;
    }
}
