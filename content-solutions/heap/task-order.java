import java.util.*;

class Solution {
    public int[] solution(int[][] tasks) {
        int n = tasks.length;
        Integer[] order = new Integer[n];
        for (int j = 0; j < n; j++) order[j] = j;
        Arrays.sort(order, (a, b) -> Integer.compare(tasks[a][0], tasks[b][0]));
        PriorityQueue<int[]> h = new PriorityQueue<>((a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(a[1], b[1]));
        int[] answer = new int[n];
        int done = 0, i = 0;
        long time = 0;
        while (done < n) {
            while (i < n && tasks[order[i]][0] <= time) {
                int j = order[i];
                h.offer(new int[] {tasks[j][1], j});
                i++;
            }
            if (h.isEmpty()) {
                time = tasks[order[i]][0];
                continue;
            }
            int[] top = h.poll();
            answer[done++] = top[1];
            time += top[0];
        }
        return answer;
    }
}
