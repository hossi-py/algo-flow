class Solution {
    static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    String[] board;
    String word;
    boolean[][] used;
    int rows, cols;

    public boolean solution(String[] board, String word) {
        this.board = board;
        this.word = word;
        rows = board.length;
        cols = board[0].length();
        int[] have = new int[26];
        for (String row : board) for (char ch : row.toCharArray()) have[ch - 'A']++;
        for (char ch : word.toCharArray()) if (--have[ch - 'A'] < 0) return false;
        used = new boolean[rows][cols];
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) if (search(r, c, 0)) return true;
        }
        return false;
    }

    boolean search(int r, int c, int k) {
        if (board[r].charAt(c) != word.charAt(k)) return false;
        if (k == word.length() - 1) return true;
        used[r][c] = true;
        for (int[] d : DIRS) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !used[nr][nc] && search(nr, nc, k + 1)) {
                used[r][c] = false;
                return true;
            }
        }
        used[r][c] = false;
        return false;
    }
}
