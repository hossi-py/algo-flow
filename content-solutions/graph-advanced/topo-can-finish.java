import java.util.*;

class Solution {
    public int solution(int n, int[][] prereqs) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        int[] indeg = new int[n];
        for (int[] p : prereqs) {
            graph.get(p[0]).add(p[1]);
            indeg[p[1]]++;
        }
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        for (int v = 0; v < n; v++) if (indeg[v] == 0) queue.add(v);
        int done = 0;
        while (!queue.isEmpty()) {
            int v = queue.poll();
            done++;
            for (int w : graph.get(v)) {
                if (--indeg[w] == 0) queue.add(w);
            }
        }
        return done;
    }
}
