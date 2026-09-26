import java.util.*;

class Solution {
    public int solution(int[] times, int[][] prereqs) {
        int n = times.length;
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        int[] indeg = new int[n];
        for (int[] p : prereqs) {
            graph.get(p[0]).add(p[1]);
            indeg[p[1]]++;
        }
        int[] finish = times.clone();
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        for (int v = 0; v < n; v++) if (indeg[v] == 0) queue.add(v);
        while (!queue.isEmpty()) {
            int v = queue.poll();
            for (int w : graph.get(v)) {
                finish[w] = Math.max(finish[w], finish[v] + times[w]);
                if (--indeg[w] == 0) queue.add(w);
            }
        }
        int answer = 0;
        for (int f : finish) answer = Math.max(answer, f);
        return answer;
    }
}
