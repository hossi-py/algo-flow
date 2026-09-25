function solution(arrivals, buses, interval, capacity) {
  const answer = new Array(arrivals.length).fill(-1);
  const waiting = [];
  let head = 0;
  let nxt = 0;
  for (let bus = 1; bus <= buses; bus++) {
    const time = bus * interval;
    while (nxt < arrivals.length && arrivals[nxt] <= time) waiting.push(nxt++);
    const count = Math.min(capacity, waiting.length - head);
    for (let i = 0; i < count; i++) answer[waiting[head++]] = bus;
  }
  return answer;
}
