class Solution {
    public int solution(int a, int b, int m) {
        return power(a, b, m);
    }

    int power(int a, int e, int m) {
        if (e == 0) return 1 % m;
        int half = power(a, e / 2, m);
        int result = half * half % m;
        if (e % 2 == 1) result = result * (a % m) % m;
        return result;
    }
}
