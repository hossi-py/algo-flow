import java.util.*;

class Solution {
    static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    int[] parent, size;

    void init(int n) {
        parent = new int[n];
        size = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            size[i] = 1;
        }
    }

    int find(int x) {
        int root = x;
        while (parent[root] != root) root = parent[root];
        while (x != root) {
            int next = parent[x];
            parent[x] = root;
            x = next;
        }
        return root;
    }

    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (size[ra] < size[rb]) {
            int t = ra;
            ra = rb;
            rb = t;
        }
        parent[rb] = ra;
        size[ra] += size[rb];
        return true;
    }

    public int[] solution(int rows, int cols, int[][] positions) {
        init(rows * cols);
        boolean[][] land = new boolean[rows][cols];
        int count = 0;
        int[] answer = new int[positions.length];
        for (int k = 0; k < positions.length; k++) {
            int r = positions[k][0], c = positions[k][1];
            if (!land[r][c]) {
                land[r][c] = true;
                count++;
                for (int[] d : DIRS) {
                    int nr = r + d[0], nc = c + d[1];
                    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || !land[nr][nc]) continue;
                    if (union(r * cols + c, nr * cols + nc)) count--;
                }
            }
            answer[k] = count;
        }
        return answer;
    }
}
