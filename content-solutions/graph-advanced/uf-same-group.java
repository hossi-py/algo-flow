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

    public List<String> solution(int n, int[][] ops) {
        init(n);
        List<String> answer = new ArrayList<>();
        for (int[] op : ops) {
            if (op[0] == 0) union(op[1], op[2]);
            else answer.add(find(op[1]) == find(op[2]) ? "YES" : "NO");
        }
        return answer;
    }
}
