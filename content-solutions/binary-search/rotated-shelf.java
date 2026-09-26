class Solution {
    int find(int[] a, int x, int lo, int hi) {
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1;
            if (a[mid] == x) return mid;
            if (a[mid] < x) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }

    public int[] solution(int[] shelf, int[] queries) {
        int n = shelf.length;
        int lo = 0, hi = n - 1;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (shelf[mid] > shelf[n - 1]) lo = mid + 1;
            else hi = mid;
        }
        int p = lo;
        int[] answer = new int[queries.length];
        for (int i = 0; i < queries.length; i++) {
            int x = queries[i];
            answer[i] = x <= shelf[n - 1] ? find(shelf, x, p, n - 1) : find(shelf, x, 0, p - 1);
        }
        return answer;
    }
}
