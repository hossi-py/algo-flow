import java.util.*;

class Solution {
    static final int[] DR = {0, 1, 0, -1};
    static final int[] DC = {1, 0, -1, 0};

    public int solution(int n, int[][] apples, int[] times, String dirs) {
        Set<Integer> apple = new HashSet<>();
        for (int[] a : apples) apple.add(a[0] * n + a[1]);
        ArrayDeque<int[]> body = new ArrayDeque<>();
        body.addFirst(new int[] {0, 0});
        Set<Integer> occupied = new HashSet<>();
        occupied.add(0);
        int d = 0, t = 0, k = 0;
        while (true) {
            t++;
            int[] head = body.peekFirst();
            int nr = head[0] + DR[d], nc = head[1] + DC[d];
            if (nr < 0 || nr >= n || nc < 0 || nc >= n || occupied.contains(nr * n + nc)) return t;
            body.addFirst(new int[] {nr, nc});
            occupied.add(nr * n + nc);
            if (!apple.remove(nr * n + nc)) {
                int[] tail = body.pollLast();
                occupied.remove(tail[0] * n + tail[1]);
            }
            if (k < times.length && times[k] == t) {
                d = dirs.charAt(k) == 'D' ? (d + 1) % 4 : (d + 3) % 4;
                k++;
            }
        }
    }
}
