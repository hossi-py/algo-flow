function solution(heights) {
  let l = 0;
  let r = heights.length - 1;
  let lmax = 0;
  let rmax = 0;
  let water = 0;
  while (l <= r) {
    if (lmax <= rmax) {
      lmax = Math.max(lmax, heights[l]);
      water += lmax - heights[l];
      l++;
    } else {
      rmax = Math.max(rmax, heights[r]);
      water += rmax - heights[r];
      r--;
    }
  }
  return water;
}
