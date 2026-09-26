-- 주간 XP 랭킹과 이상 기록 탐지. 여러 번 실행해도 안전하다.
--
-- 주: 월요일~일요일 (Asia/Seoul). 점수: 그 주 activity_days.xp_earned 합.
-- 이상 기록이 있는 회원은 그 주 랭킹에서 빠지고 관리자 화면에 나온다 (계정·기록은 그대로 둔다).

-- 랭킹에 내 닉네임을 보일지 (기본: 보임). 본인이 설정에서 바꾼다
alter table public.profiles add column if not exists show_in_ranking boolean not null default true;
grant update (show_in_ranking) on public.profiles to authenticated;

-- 이상 기록 탐지 (서버가 믿을 수 있는 시각인 submissions.created_at과, 병합으로도 들어오는 activity_days를 함께 본다)
--   rapid-solves : 10분 안에 서로 다른 문제 10개 이상을 처음 맞힘
--   xp-overflow  : 하루 XP가 4,000 초과 (콘텐츠 전체로 하루에 얻을 수 있는 XP는 약 3,800)
--   tiny-code    : 공백을 뺀 길이 20자 미만인 코드로 정답
create or replace function public.ranking_flags(p_from date, p_to date)
returns table (user_id uuid, reason text, detail text)
language sql
stable
security definer
set search_path = public
as $$
  with first_accepts as (
    select s.user_id, s.problem_key, min(s.created_at) as at
    from public.submissions s
    where s.verdict = 'accepted'
      and (s.created_at at time zone 'Asia/Seoul')::date between p_from and p_to
    group by s.user_id, s.problem_key
  ),
  rapid as (
    select a.user_id, max(cnt) as burst
    from (
      select f.user_id,
        (select count(*) from first_accepts g where g.user_id = f.user_id and g.at between f.at - interval '10 minutes' and f.at) as cnt
      from first_accepts f
    ) a
    group by a.user_id
    having max(cnt) >= 10
  ),
  overflow as (
    select d.user_id, max(d.xp_earned) as peak
    from public.activity_days d
    where d.activity_date between p_from and p_to
    group by d.user_id
    having max(d.xp_earned) > 4000
  ),
  tiny as (
    select s.user_id, count(*) as n
    from public.submissions s
    where s.verdict = 'accepted'
      and (s.created_at at time zone 'Asia/Seoul')::date between p_from and p_to
      and char_length(regexp_replace(s.code, '\s', '', 'g')) < 20
    group by s.user_id
  )
  select user_id, 'rapid-solves', format('10분 안에 %s문제를 처음 맞힘', burst) from rapid
  union all
  select user_id, 'xp-overflow', format('하루 XP %s', peak) from overflow
  union all
  select user_id, 'tiny-code', format('20자 미만 코드로 정답 %s번', n) from tiny;
$$;

-- 이번 주 랭킹: 상위 p_limit명 + (순위 밖이어도) p_user_id 본인 행.
-- 랭킹을 숨긴 회원·이상 기록이 있는 회원·XP 0인 회원은 빠진다. 같은 XP는 같은 순위.
create or replace function public.weekly_ranking(
  p_user_id uuid default null,
  p_limit   int  default 50,
  p_today   date default (now() at time zone 'Asia/Seoul')::date
)
returns table (
  rank        int,
  nickname    text,
  xp          int,
  solved      int,
  is_me       boolean,
  week_start  date,
  week_end    date,
  participants int
)
language sql
stable
security definer
set search_path = public
as $$
  with week as (
    select p_today - (extract(isodow from p_today)::int - 1) as start_day
  ),
  flagged as (
    select distinct f.user_id from week w, public.ranking_flags(w.start_day, w.start_day + 6) f
  ),
  scores as (
    select d.user_id, sum(d.xp_earned)::int as xp, sum(d.solved_count)::int as solved
    from public.activity_days d, week w
    where d.activity_date between w.start_day and w.start_day + 6
    group by d.user_id
  ),
  ranked as (
    select
      rank() over (order by s.xp desc)::int as rank,
      p.nickname,
      s.xp,
      s.solved,
      s.user_id = p_user_id as is_me,
      count(*) over ()::int as participants
    from scores s
    join public.profiles p on p.id = s.user_id
    where s.xp > 0
      and p.show_in_ranking
      and s.user_id not in (select user_id from flagged)
  )
  select r.rank, r.nickname, r.xp, r.solved, r.is_me, w.start_day, w.start_day + 6, r.participants
  from ranked r, week w
  where r.rank <= greatest(1, least(coalesce(p_limit, 50), 100)) or r.is_me
  order by r.rank, r.nickname;
$$;

do $$
declare
  fn text;
begin
  foreach fn in array array['public.ranking_flags(date, date)', 'public.weekly_ranking(uuid, int, date)']
  loop
    execute format('revoke execute on function %s from public, anon, authenticated', fn);
    execute format('grant execute on function %s to service_role', fn);
  end loop;
end;
$$;
