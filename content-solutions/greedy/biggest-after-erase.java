class Solution {
    public String solution(String number, int k) {
        StringBuilder stack = new StringBuilder();
        for (char d : number.toCharArray()) {
            while (k > 0 && stack.length() > 0 && stack.charAt(stack.length() - 1) < d) {
                stack.deleteCharAt(stack.length() - 1);
                k--;
            }
            stack.append(d);
        }
        stack.setLength(stack.length() - k);
        return stack.toString();
    }
}
