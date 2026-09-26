class Solution {
    public int solution(int[] stones) {
        int[] tails = new int[stones.length];
        int size = 0;
        for (int x : stones) {
            int lo = 0, hi = size;
            while (lo < hi) {
                int mid = (lo + hi) >>> 1;
                if (tails[mid] >= x) hi = mid;
                else lo = mid + 1;
            }
            tails[lo] = x;
            if (lo == size) size++;
        }
        return size;
    }
}
