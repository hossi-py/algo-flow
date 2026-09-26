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

    public int solution(int n, int[][] cables) {
        init(n);
        int[][] sorted = cables.clone();
        Arrays.sort(sorted, (x, y) -> Integer.compare(x[2], y[2]));
        int total = 0, picked = 0;
        for (int[] e : sorted) {
            if (union(e[0], e[1])) {
                total += e[2];
                picked++;
            }
        }
        return picked == n - 1 ? total : -1;
    }
}
