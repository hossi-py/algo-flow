class Solution {
    public boolean solution(String word, String letter) {
        int i = 0;
        for (int j = 0; j < letter.length(); j++) {
            if (i < word.length() && letter.charAt(j) == word.charAt(i)) i++;
        }
        return i == word.length();
    }
}
