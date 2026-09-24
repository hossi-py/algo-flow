import java.util.*;

class Solution {
    public List<Integer> solution(int n, int[][] edges, int x) {
        List<Integer> result = new ArrayList<>();
        for (int[] e : edges) {
            if (e[0] == x) result.add(e[1]);
            else if (e[1] == x) result.add(e[0]);
        }
        Collections.sort(result);
        return result;
    }
}
