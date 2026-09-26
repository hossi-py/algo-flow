class Solution {
    public int[] solution(int[] nums) {
        int n = nums.length;
        int[] answer = new int[n];
        int l = 0, r = n - 1;
        for (int k = n - 1; k >= 0; k--) {
            if (Math.abs(nums[l]) > Math.abs(nums[r])) {
                answer[k] = nums[l] * nums[l];
                l++;
            } else {
                answer[k] = nums[r] * nums[r];
                r--;
            }
        }
        return answer;
    }
}
