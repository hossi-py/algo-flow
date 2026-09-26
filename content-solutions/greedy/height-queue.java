import java.util.*;

class Solution {
    public int[][] solution(int[][] people) {
        int[][] sorted = people.clone();
        Arrays.sort(sorted, (a, b) -> a[0] != b[0] ? Integer.compare(b[0], a[0]) : Integer.compare(a[1], b[1]));
        List<int[]> line = new ArrayList<>();
        for (int[] p : sorted) line.add(p[1], p);
        return line.toArray(new int[0][]);
    }
}
