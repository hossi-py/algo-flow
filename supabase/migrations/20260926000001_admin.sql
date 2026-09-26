-- 관리자 화면: 관리자 계정 목록과, 관리자 화면만 쓰는 조회 함수.
-- 모두 service role 전용이다. 서버가 요청한 사람이 admins에 있는지 확인한 뒤에만 부른다 (src/lib/admin).
-- 여러 번 실행해도 안전하다 (테이블은 없을 때만 만들고, 함수는 덮어쓴다).
--
-- 관리자 등록 (Supabase SQL Editor에서 한 번):
--   insert into public.admins (user_id, note)
--   select id, '운영자' from auth.users where email = '내-이메일@example.com';

create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  note       text check (char_length(note) <= 200),
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security; -- 정책 없음 = service role 전용
revoke all on public.admins from anon, authenticated;

-- 회원 목록: 이메일·닉네임 검색, 정렬, 페이지. total_count는 검색 결과 전체 수
create or replace function public.admin_list_users(
  p_search text default '',
  p_sort   text default 'joined',
  p_limit  int  default 50,
  p_offset int  default 0
)
returns table (
  id               uuid,
  email            text,
  nickname         text,
  joined_at        timestamptz,
  last_sign_in_at  timestamptz,
  last_active_date date,
  xp               int,
  current_streak   int,
  solved_count     int,
  submission_count int,
  total_count      bigint
)
language sql
stable
security definer
set search_path = public, auth
as $$
  with pattern as (
    select '%' || replace(replace(replace(btrim(coalesce(p_search, '')), '\', '\\'), '%', '\%'), '_', '\_') || '%' as value
  ),
  rows as (
    select
      u.id,
      u.email::text as email,
      p.nickname,
      u.created_at as joined_at,
      u.last_sign_in_at,
      s.last_active_date,
      coalesce(s.xp, 0) as xp,
      coalesce(s.current_streak, 0) as current_streak,
      (select count(*)::int from public.problem_progress pp where pp.user_id = u.id and pp.status = 'solved') as solved_count,
      (select count(*)::int from public.submissions sb where sb.user_id = u.id) as submission_count
    from auth.users u
    join public.profiles p on p.id = u.id
    left join public.user_stats s on s.user_id = u.id
    cross join pattern
    where u.email ilike pattern.value escape '\' or p.nickname ilike pattern.value escape '\'
  )
  select rows.*, count(*) over () as total_count
  from rows
  order by
    case when p_sort = 'email' then rows.email end asc,
    case when p_sort = 'xp' then rows.xp end desc,
    case when p_sort = 'solved' then rows.solved_count end desc,
    case when p_sort = 'active' then rows.last_active_date end desc nulls last,
    rows.joined_at desc,
    rows.id
  limit greatest(1, least(coalesce(p_limit, 50), 100))
  offset greatest(0, coalesce(p_offset, 0));
$$;

-- 회원 한 명의 계정 정보 (auth.users에만 있는 값). 나머지 상세는 서버가 public 테이블에서 직접 읽는다
create or replace function public.admin_user_account(p_user_id uuid)
returns table (email text, joined_at timestamptz, last_sign_in_at timestamptz, is_admin boolean)
language sql
stable
security definer
set search_path = public, auth
as $$
  select u.email::text, u.created_at, u.last_sign_in_at, exists (select 1 from public.admins a where a.user_id = u.id)
  from auth.users u
  where u.id = p_user_id;
$$;

-- 운영 현황: 합계와 최근 p_days일의 날짜별 추이 (Asia/Seoul 기준 날짜)
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

do $$
declare
  fn text;
begin
  foreach fn in array array[
    'public.admin_list_users(text, text, int, int)',
    'public.admin_user_account(uuid)',
    'public.admin_overview(int, date)'
  ]
  loop
    execute format('revoke execute on function %s from public, anon, authenticated', fn);
    execute format('grant execute on function %s to service_role', fn);
  end loop;
end;
$$;
