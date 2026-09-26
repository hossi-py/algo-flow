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

    public int[] solution(int n, int[][] pairs) {
        init(n);
        for (int[] p : pairs) union(p[0], p[1]);
        List<Integer> sizes = new ArrayList<>();
        for (int i = 0; i < n; i++) if (find(i) == i) sizes.add(size[i]);
        sizes.sort(Collections.reverseOrder());
        int[] answer = new int[sizes.size()];
        for (int i = 0; i < answer.length; i++) answer[i] = sizes.get(i);
        return answer;
    }
}
