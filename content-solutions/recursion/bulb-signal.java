class Solution {
    public String solution(int n) {
        return signal(n);
    }

    String signal(int n) {
        if (n < 2) return String.valueOf(n);
        return signal(n / 2) + (n % 2);
    }
}
