import java.util.*;

class Solution {
    String[] names;
    int k;
    boolean[] used;
    List<String> path = new ArrayList<>();
    List<List<String>> answer = new ArrayList<>();

    public List<List<String>> solution(String[] names, int k) {
        this.names = names;
        this.k = k;
        used = new boolean[names.length];
        pick();
        return answer;
    }

    void pick() {
        if (path.size() == k) {
            answer.add(new ArrayList<>(path));
            return;
        }
        for (int i = 0; i < names.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            path.add(names[i]);
            pick();
            path.remove(path.size() - 1);
            used[i] = false;
        }
    }
}
