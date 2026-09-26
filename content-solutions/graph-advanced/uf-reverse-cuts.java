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

    public int[] solution(int n, int[][] bridges, int[] cuts) {
        init(n);
        boolean[] cut = new boolean[bridges.length];
        for (int c : cuts) cut[c] = true;
        int groups = n;
        for (int i = 0; i < bridges.length; i++) {
            if (!cut[i] && union(bridges[i][0], bridges[i][1])) groups--;
        }
        int[] answer = new int[cuts.length];
        for (int k = cuts.length - 1; k >= 0; k--) {
            answer[k] = groups;
            int[] b = bridges[cuts[k]];
            if (union(b[0], b[1])) groups--;
        }
        return answer;
    }
}
