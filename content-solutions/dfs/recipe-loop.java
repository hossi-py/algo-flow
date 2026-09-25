import java.util.*;

class Solution {
    private List<List<Integer>> graph;
    private int[] state;

    boolean hasCycle(int v) {
        state[v] = 1;
        for (int w : graph.get(v)) {
            if (state[w] == 1) return true;
            if (state[w] == 0 && hasCycle(w)) return true;
        }
        state[v] = 2;
        return false;
    }

    public boolean solution(int n, int[][] rules) {
        graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] e : rules) {
            graph.get(e[0]).add(e[1]);
        }
        state = new int[n];
        for (int v = 0; v < n; v++) {
            if (state[v] == 0 && hasCycle(v)) return false;
        }
        return true;
    }
}
