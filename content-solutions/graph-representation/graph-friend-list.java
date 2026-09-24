import java.util.*;

class Solution {
    public List<List<Integer>> solution(int n, int[][] pairs) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] e : pairs) {
            graph.get(e[0]).add(e[1]);
            graph.get(e[1]).add(e[0]);
        }
        for (List<Integer> friends : graph) Collections.sort(friends);
        return graph;
    }
}
