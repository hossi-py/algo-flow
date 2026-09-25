-- 에러 모니터링: 서버(onRequestError)·브라우저(/api/errors)에서 모은 에러 기록.
-- 서버가 service role로만 쓰고 읽는다. 클라이언트 키(anon·authenticated)로는 읽을 수도 쓸 수도 없다.
-- 저장 전에 앱에서 길이를 자르고, 쿼리·이메일·토큰을 가려 둔다 (src/lib/monitoring/event.ts).

create table public.error_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  source text not null check (source in ('server', 'client', 'boundary', 'engine')),
  fingerprint text not null check (char_length(fingerprint) <= 32),
  message text not null check (char_length(message) <= 500),
  stack text check (char_length(stack) <= 4000),
  digest text check (char_length(digest) <= 100),
  path text check (char_length(path) <= 300),
  route_path text check (char_length(route_path) <= 300),
  route_type text check (char_length(route_type) <= 20),
  user_agent text check (char_length(user_agent) <= 300),
  release text check (char_length(release) <= 100)
);

create index error_events_created_at_idx on public.error_events (created_at desc);
create index error_events_fingerprint_idx on public.error_events (fingerprint, created_at desc);

alter table public.error_events enable row level security; -- 정책 없음 = service role 전용
revoke all on public.error_events from anon, authenticated;

-- 같은 원인(fingerprint)끼리 묶어 본다: 몇 번, 언제부터 언제까지, 대표 메시지
create view public.error_groups
with (security_invoker = true)
as
select
  fingerprint,
  source,
  count(*)::int as occurrences,
  min(created_at) as first_seen,
  max(created_at) as last_seen,
  (array_agg(message order by created_at desc))[1] as latest_message,
  (array_agg(path order by created_at desc))[1] as latest_path,
  (array_agg(release order by created_at desc))[1] as latest_release
from public.error_events
group by fingerprint, source;

revoke all on public.error_groups from anon, authenticated;

-- 오래된 기록 정리 (예: Supabase Cron으로 매일 select public.prune_error_events(30);)
create function public.prune_error_events(keep_days int default 30)
returns int
language sql
security definer
set search_path = public
as $$
  with deleted as (
    delete from public.error_events
    where created_at < now() - make_interval(days => greatest(keep_days, 1))
    returning 1
  )
  select count(*)::int from deleted;
$$;

revoke execute on function public.prune_error_events(int) from public, anon, authenticated;
grant execute on function public.prune_error_events(int) to service_role;
