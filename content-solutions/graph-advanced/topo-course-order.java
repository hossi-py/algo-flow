import java.util.*;

class Solution {
    public int[] solution(int n, int[][] prereqs) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        int[] indeg = new int[n];
        for (int[] p : prereqs) {
            graph.get(p[0]).add(p[1]);
            indeg[p[1]]++;
        }
        PriorityQueue<Integer> heap = new PriorityQueue<>();
        for (int v = 0; v < n; v++) if (indeg[v] == 0) heap.offer(v);
        int[] order = new int[n];
        int count = 0;
        while (!heap.isEmpty()) {
            int v = heap.poll();
            order[count++] = v;
            for (int w : graph.get(v)) {
                indeg[w]--;
                if (indeg[w] == 0) heap.offer(w);
            }
        }
        return count == n ? order : new int[0];
    }
}
