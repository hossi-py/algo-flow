class Solution {
    public int[] solution(int[] baskets) {
        int[] answer = new int[baskets.length];
        int w = 0;
        for (int x : baskets) {
            if (x != 0) {
                answer[w] = x;
                w++;
            }
        }
        return answer;
    }
}
