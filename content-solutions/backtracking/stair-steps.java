import java.util.*;

class Solution {
    List<List<Integer>> answer = new ArrayList<>();
    List<Integer> path = new ArrayList<>();

    public List<List<Integer>> solution(int n) {
        climb(n);
        return answer;
    }

    void climb(int remain) {
        if (remain == 0) {
            answer.add(new ArrayList<>(path));
            return;
        }
        for (int step = 1; step <= 2; step++) {
            if (step <= remain) {
                path.add(step);
                climb(remain - step);
                path.remove(path.size() - 1);
            }
        }
    }
}
