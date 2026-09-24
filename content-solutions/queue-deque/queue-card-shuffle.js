function solution(n) {
  const cards = Array.from({ length: n }, (_, i) => i + 1);
  let head = 0;
  while (cards.length - head > 1) {
    head += 1;
    cards.push(cards[head++]);
  }
  return cards[head];
}
