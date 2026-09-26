class Solution {
    public int[] solution(int[] scores) {
        int[] count = new int[101];
        for (int s : scores) count[s]++;
        int[] higher = new int[101];
        for (int v = 99; v >= 0; v--) higher[v] = higher[v + 1] + count[v + 1];
        int[] answer = new int[scores.length];
        for (int i = 0; i < scores.length; i++) answer[i] = higher[scores[i]] + 1;
        return answer;
    }
}
