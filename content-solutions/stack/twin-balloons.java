class Solution {
    public String solution(String balloons) {
        StringBuilder stack = new StringBuilder();
        for (char c : balloons.toCharArray()) {
            if (stack.length() > 0 && stack.charAt(stack.length() - 1) == c) stack.deleteCharAt(stack.length() - 1);
            else stack.append(c);
        }
        return stack.toString();
    }
}
