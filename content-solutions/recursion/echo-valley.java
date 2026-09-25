import java.util.*;

class Solution {
    public List<Integer> solution(int n) {
        List<Integer> answer = new ArrayList<>();
        echo(n, answer);
        return answer;
    }

    void echo(int k, List<Integer> answer) {
        if (k == 0) return;
        answer.add(k);
        echo(k - 1, answer);
        answer.add(k);
    }
}
