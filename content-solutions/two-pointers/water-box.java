class Solution {
    public int solution(int[] walls) {
        int l = 0, r = walls.length - 1, best = 0;
        while (l < r) {
            best = Math.max(best, Math.min(walls[l], walls[r]) * (r - l));
            if (walls[l] < walls[r]) l++;
            else r--;
        }
        return best;
    }
}
