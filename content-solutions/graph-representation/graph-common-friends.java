import java.util.*;

class Solution {
    public List<Integer> solution(int n, int[][] pairs, int u, int v) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] e : pairs) {
            graph.get(e[0]).add(e[1]);
            graph.get(e[1]).add(e[0]);
        }
        Set<Integer> friendsU = new HashSet<>(graph.get(u));
        List<Integer> common = new ArrayList<>();
        for (int x : graph.get(v)) if (friendsU.contains(x)) common.add(x);
        Collections.sort(common);
        return common;
    }
}
