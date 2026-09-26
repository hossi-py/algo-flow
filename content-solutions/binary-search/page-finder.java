class Solution {
    int find(int[] books, int x) {
        int lo = 0, hi = books.length - 1;
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1;
            if (books[mid] == x) return mid;
            if (books[mid] < x) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }

    public int[] solution(int[] books, int[] queries) {
        int[] answer = new int[queries.length];
        for (int i = 0; i < queries.length; i++) answer[i] = find(books, queries[i]);
        return answer;
    }
}
