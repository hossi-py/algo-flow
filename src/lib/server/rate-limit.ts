import { toLocalDate } from "@/lib/date";

/**
 * 프로세스 메모리에 두는 일일 사용량 카운터 (서버를 다시 시작하면 초기화).
 * 여러 인스턴스로 배포하면 인스턴스마다 따로 세므로, 비용이 큰 기능은 DB 기준 한도도 함께 쓴다.
 */
interface Bucket {
  day: string;
  count: number;
}

const globalBuckets = globalThis as typeof globalThis & { __algoFlowRateLimit?: Map<string, Bucket> };
const buckets = (globalBuckets.__algoFlowRateLimit ??= new Map<string, Bucket>());

export interface LimitResult {
  ok: boolean;
  remaining: number;
}

/** key의 오늘(Asia/Seoul) 사용량을 1 올린다. 한도를 넘으면 올리지 않고 ok: false */
export function consumeDaily(key: string, limit: number, now = new Date()): LimitResult {
  const day = toLocalDate(now);
  const bucket = buckets.get(key);
  const count = bucket && bucket.day === day ? bucket.count : 0;
  if (count >= limit) return { ok: false, remaining: 0 };
  buckets.set(key, { day, count: count + 1 });
  return { ok: true, remaining: limit - count - 1 };
}

/** Asia/Seoul 기준 오늘 0시 */
export function startOfLocalDay(now = new Date()): Date {
  return new Date(`${toLocalDate(now)}T00:00:00+09:00`);
}
