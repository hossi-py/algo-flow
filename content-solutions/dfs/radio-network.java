class Solution {
    private int[][] link;
    private boolean[] visited;
    private int n;

    int dfs(int v) {
        visited[v] = true;
        int size = 1;
        for (int w = 0; w < n; w++) {
            if (link[v][w] == 1 && !visited[w]) size += dfs(w);
        }
        return size;
    }

    public int[] solution(int[][] link) {
        this.link = link;
        n = link.length;
        visited = new boolean[n];
        int groups = 0, largest = 0;
        for (int v = 0; v < n; v++) {
            if (!visited[v]) {
                groups++;
                largest = Math.max(largest, dfs(v));
            }
        }
        return new int[] {groups, largest};
    }
}
