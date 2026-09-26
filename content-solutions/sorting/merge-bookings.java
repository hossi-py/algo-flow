import java.util.*;

class Solution {
    public int[][] solution(int[][] bookings) {
        int[][] sorted = bookings.clone();
        Arrays.sort(sorted, (x, y) -> Integer.compare(x[0], y[0]));
        List<int[]> out = new ArrayList<>();
        for (int[] b : sorted) {
            if (!out.isEmpty() && out.get(out.size() - 1)[1] >= b[0]) {
                int[] last = out.get(out.size() - 1);
                last[1] = Math.max(last[1], b[1]);
            } else {
                out.add(new int[] {b[0], b[1]});
            }
        }
        return out.toArray(new int[0][]);
    }
}
