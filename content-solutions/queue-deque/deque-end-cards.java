class Solution {
    public int[] solution(int[] cards) {
        int[] score = new int[2];
        int left = 0, right = cards.length - 1, turn = 0;
        while (left <= right) {
            int card = cards[left] >= cards[right] ? cards[left++] : cards[right--];
            score[turn % 2] += card;
            turn++;
        }
        return score;
    }
}
