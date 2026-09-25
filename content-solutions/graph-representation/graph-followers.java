import java.util.*;

class Solution {
    public List<List<Integer>> solution(int n, int[][] follows) {
        List<List<Integer>> followers = new ArrayList<>();
        for (int i = 0; i < n; i++) followers.add(new ArrayList<>());
        for (int[] f : follows) followers.get(f[1]).add(f[0]);
        for (List<Integer> list : followers) Collections.sort(list);
        return followers;
    }
}
