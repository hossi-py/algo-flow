-- 운영 현황에 "이번 주 vs 지난주" 비교를 더한다 (관리자 화면 KPI의 변화 뱃지).
-- current = 오늘 포함 최근 7일, previous = 그 전 7일 (Asia/Seoul 날짜). 여러 번 실행해도 안전하다.

create or replace function public.admin_overview(
  p_days  int  default 14,
  p_today date default (now() at time zone 'Asia/Seoul')::date
)
returns jsonb
language sql
stable
security definer
set search_path = public, auth
as $$
  with days as (
    select generate_series(p_today - (greatest(1, least(p_days, 90)) - 1), p_today, interval '1 day')::date as day
  ),
  win as (
    select p_today - 6 as cur_from, p_today as cur_to, p_today - 13 as prev_from, p_today - 7 as prev_to
  )
  select jsonb_build_object(
    'totals', jsonb_build_object(
      'users', (select count(*) from auth.users),
      'activeLast7Days', (select count(distinct user_id) from public.activity_days where activity_date > p_today - 7),
      'submissions', (select count(*) from public.submissions),
      'accepted', (select count(*) from public.submissions where verdict = 'accepted'),
      'solvedProblems', (select count(*) from public.problem_progress where status = 'solved'),
      'generatedProblems', (select count(*) from public.generated_problems),
      'coachMessages', (select count(*) from public.coach_messages where role = 'user')
    ),
    'weekly', (
      select jsonb_build_object(
        'signups', jsonb_build_object(
          'current', (select count(*) from auth.users u where (u.created_at at time zone 'Asia/Seoul')::date between w.cur_from and w.cur_to),
          'previous', (select count(*) from auth.users u where (u.created_at at time zone 'Asia/Seoul')::date between w.prev_from and w.prev_to)
        ),
        'activeUsers', jsonb_build_object(
          'current', (select count(distinct user_id) from public.activity_days a where a.activity_date between w.cur_from and w.cur_to),
          'previous', (select count(distinct user_id) from public.activity_days a where a.activity_date between w.prev_from and w.prev_to)
        ),
        'submissions', jsonb_build_object(
          'current', (select count(*) from public.submissions s where (s.created_at at time zone 'Asia/Seoul')::date between w.cur_from and w.cur_to),
          'previous', (select count(*) from public.submissions s where (s.created_at at time zone 'Asia/Seoul')::date between w.prev_from and w.prev_to)
        ),
        'solvedProblems', jsonb_build_object(
          'current', (select count(*) from public.problem_progress p where (p.solved_at at time zone 'Asia/Seoul')::date between w.cur_from and w.cur_to),
          'previous', (select count(*) from public.problem_progress p where (p.solved_at at time zone 'Asia/Seoul')::date between w.prev_from and w.prev_to)
        ),
        'generatedProblems', jsonb_build_object(
          'current', (select count(*) from public.generated_problems g where (g.created_at at time zone 'Asia/Seoul')::date between w.cur_from and w.cur_to),
          'previous', (select count(*) from public.generated_problems g where (g.created_at at time zone 'Asia/Seoul')::date between w.prev_from and w.prev_to)
        ),
        'coachMessages', jsonb_build_object(
          'current', (select count(*) from public.coach_messages c where c.role = 'user' and (c.created_at at time zone 'Asia/Seoul')::date between w.cur_from and w.cur_to),
          'previous', (select count(*) from public.coach_messages c where c.role = 'user' and (c.created_at at time zone 'Asia/Seoul')::date between w.prev_from and w.prev_to)
        )
      )
      from win w
    ),
    'daily', (
      select jsonb_agg(
        jsonb_build_object(
          'day', d.day,
          'signups', (select count(*) from auth.users u where (u.created_at at time zone 'Asia/Seoul')::date = d.day),
          'activeUsers', (select count(*) from public.activity_days a where a.activity_date = d.day),
          'submissions', (select count(*) from public.submissions s where (s.created_at at time zone 'Asia/Seoul')::date = d.day),
          'accepted', (
            select count(*) from public.submissions s
            where (s.created_at at time zone 'Asia/Seoul')::date = d.day and s.verdict = 'accepted'
          )
        )
        order by d.day
      )
      from days d
    )
  );
$$;

revoke execute on function public.admin_overview(int, date) from public, anon, authenticated;
grant execute on function public.admin_overview(int, date) to service_role;
