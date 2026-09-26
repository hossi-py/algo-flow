class Solution {
    public int solution(String trees, int k) {
        int[] count = new int[26];
        int kinds = 0, l = 0, best = 0;
        for (int r = 0; r < trees.length(); r++) {
            if (count[trees.charAt(r) - 'a']++ == 0) kinds++;
            while (kinds > k) {
                int left = trees.charAt(l) - 'a';
                count[left]--;
                if (count[left] == 0) kinds--;
                l++;
            }
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
}
