class Solution {
    public int solution(int a, int b) {
        if (b == 0) return a;
        return solution(b, a % b);
    }
}
