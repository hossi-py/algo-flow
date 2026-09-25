class Solution {
    private String[] garden;
    private final int[] count = new int[2];

    boolean same(int r, int c, int size) {
        char first = garden[r].charAt(c);
        for (int y = r; y < r + size; y++) {
            for (int x = c; x < c + size; x++) if (garden[y].charAt(x) != first) return false;
        }
        return true;
    }

    void compress(int r, int c, int size) {
        if (same(r, c, size)) {
            count[garden[r].charAt(c) - '0']++;
            return;
        }
        int half = size / 2;
        compress(r, c, half);
        compress(r, c + half, half);
        compress(r + half, c, half);
        compress(r + half, c + half, half);
    }

    public int[] solution(String[] garden) {
        this.garden = garden;
        compress(0, 0, garden.length);
        return count;
    }
}
