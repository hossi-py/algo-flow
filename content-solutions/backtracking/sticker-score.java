import java.util.*;

class Solution {
    int[] values;
    List<Integer> path = new ArrayList<>();
    List<List<Integer>> answer = new ArrayList<>();

    public List<List<Integer>> solution(int[] values, int target) {
        this.values = values.clone();
        Arrays.sort(this.values);
        pick(0, target);
        return answer;
    }

    void pick(int start, int remain) {
        if (remain == 0) {
            answer.add(new ArrayList<>(path));
            return;
        }
        for (int i = start; i < values.length && values[i] <= remain; i++) {
            path.add(values[i]);
            pick(i, remain - values[i]);
            path.remove(path.size() - 1);
        }
    }
}
