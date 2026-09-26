class Solution {
    public int solution(String street, String recipe) {
        int[] need = new int[26];
        for (char c : recipe.toCharArray()) need[c - 'a']++;
        int missing = recipe.length(), l = 0, best = Integer.MAX_VALUE;
        for (int r = 0; r < street.length(); r++) {
            int c = street.charAt(r) - 'a';
            if (need[c] > 0) missing--;
            need[c]--;
            while (missing == 0) {
                best = Math.min(best, r - l + 1);
                int left = street.charAt(l) - 'a';
                need[left]++;
                if (need[left] > 0) missing++;
                l++;
            }
        }
        return best == Integer.MAX_VALUE ? 0 : best;
    }
}
