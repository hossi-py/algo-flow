class Solution {
    public String solution(int n, long k) {
        return letter(n, k);
    }

    String letter(int level, long pos) {
        if (level == 1) return "a";
        long half = (1L << (level - 1)) - 1;
        if (pos <= half) return letter(level - 1, pos);
        if (pos == half + 1) return "b";
        String c = letter(level - 1, pos - half - 1);
        return c.equals("a") ? "b" : "a";
    }
}
