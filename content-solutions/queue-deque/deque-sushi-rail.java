import java.util.*;

class Solution {
    public int solution(int n, int[] picks) {
        Deque<Integer> rail = new ArrayDeque<>();
        for (int i = 1; i <= n; i++) rail.addLast(i);
        int total = 0;
        for (int p : picks) {
            int idx = 0;
            for (int plate : rail) {
                if (plate == p) break;
                idx++;
            }
            int size = rail.size();
            if (idx <= size - idx) {
                for (int i = 0; i < idx; i++) rail.addLast(rail.pollFirst());
                total += idx;
            } else {
                for (int i = 0; i < size - idx; i++) rail.addFirst(rail.pollLast());
                total += size - idx;
            }
            rail.pollFirst();
        }
        return total;
    }
}
