import java.util.*;

class Solution {
    public List<Integer> solution(int[][] shelves) {
        PriorityQueue<int[]> h = new PriorityQueue<>((a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(a[1], b[1]));
        for (int i = 0; i < shelves.length; i++) {
            if (shelves[i].length > 0) h.offer(new int[] {shelves[i][0], i, 0});
        }
        List<Integer> answer = new ArrayList<>();
        while (!h.isEmpty()) {
            int[] top = h.poll();
            answer.add(top[0]);
            int i = top[1], j = top[2];
            if (j + 1 < shelves[i].length) h.offer(new int[] {shelves[i][j + 1], i, j + 1});
        }
        return answer;
    }
}
