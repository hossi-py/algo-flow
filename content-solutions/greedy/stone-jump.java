class Solution {
    public boolean solution(int[] jumps) {
        int far = 0;
        for (int i = 0; i < jumps.length; i++) {
            if (i > far) return false;
            far = Math.max(far, i + jumps[i]);
        }
        return true;
    }
}
