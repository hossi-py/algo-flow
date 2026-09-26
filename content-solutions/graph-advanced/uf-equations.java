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

    public String solution(String[] equations) {
        init(26);
        for (String e : equations) {
            if (e.charAt(1) == '=') union(e.charAt(0) - 'a', e.charAt(3) - 'a');
        }
        for (String e : equations) {
            if (e.charAt(1) == '!' && find(e.charAt(0) - 'a') == find(e.charAt(3) - 'a')) return "NO";
        }
        return "YES";
    }
}
