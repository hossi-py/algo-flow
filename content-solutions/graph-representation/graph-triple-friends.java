import java.util.*;

class Solution {
    public int solution(int n, int[][] pairs) {
        List<Set<Integer>> friends = new ArrayList<>();
        for (int i = 0; i < n; i++) friends.add(new HashSet<>());
        for (int[] p : pairs) {
            friends.get(p[0]).add(p[1]);
            friends.get(p[1]).add(p[0]);
        }
        int count = 0;
        for (int[] p : pairs) {
            Set<Integer> small = friends.get(p[0]), large = friends.get(p[1]);
            if (small.size() > large.size()) {
                Set<Integer> t = small;
                small = large;
                large = t;
            }
            for (int c : small) if (large.contains(c)) count++;
        }
        return count / 3;
    }
}
