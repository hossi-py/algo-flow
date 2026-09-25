import java.util.*;

class Solution {
    public int[] solution(int[] boss) {
        int n = boss.length;
        List<List<Integer>> children = new ArrayList<>();
        for (int i = 0; i < n; i++) children.add(new ArrayList<>());
        int root = 0;
        for (int i = 0; i < n; i++) {
            if (boss[i] == -1) root = i;
            else children.get(boss[i]).add(i);
        }
        int[] level = new int[n];
        Deque<Integer> queue = new ArrayDeque<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int u = queue.poll();
            for (int c : children.get(u)) {
                level[c] = level[u] + 1;
                queue.offer(c);
            }
        }
        return level;
    }
}
