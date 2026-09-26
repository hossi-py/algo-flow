import java.util.*;

class Solution {
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

    public long solution(int[][] points) {
        int n = points.length;
        init(n);
        int[][] edges = new int[n * (n - 1) / 2][];
        int k = 0;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int d = Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]);
                edges[k++] = new int[] {d, i, j};
            }
        }
        Arrays.sort(edges, (x, y) -> Integer.compare(x[0], y[0]));
        long total = 0;
        int picked = 0;
        for (int[] e : edges) {
            if (picked == n - 1) break;
            if (union(e[1], e[2])) {
                total += e[0];
                picked++;
            }
        }
        return total;
    }
}
