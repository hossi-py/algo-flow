function solution(cards) {
  const score = [0, 0];
  let left = 0;
  let right = cards.length - 1;
  let turn = 0;
  while (left <= right) {
    const card = cards[left] >= cards[right] ? cards[left++] : cards[right--];
    score[turn % 2] += card;
    turn += 1;
  }
  return score;
}
