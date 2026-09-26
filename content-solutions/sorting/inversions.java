class Solution {
    int[] a;
    int[] tmp;

    long sortCount(int lo, int hi) {
        if (lo >= hi) return 0;
        int mid = (lo + hi) / 2;
        long count = sortCount(lo, mid) + sortCount(mid + 1, hi);
        int i = lo, j = mid + 1, k = lo;
        while (i <= mid && j <= hi) {
            if (a[i] <= a[j]) tmp[k++] = a[i++];
            else {
                tmp[k++] = a[j++];
                count += mid - i + 1;
            }
        }
        while (i <= mid) tmp[k++] = a[i++];
        while (j <= hi) tmp[k++] = a[j++];
        for (int t = lo; t <= hi; t++) a[t] = tmp[t];
        return count;
    }

    public long solution(int[] cards) {
        a = cards.clone();
        tmp = new int[a.length];
        return sortCount(0, a.length - 1);
    }
}
