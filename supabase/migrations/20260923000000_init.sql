-- algo-flow 초기 스키마 (docs/04 §3). 테이블·제약·RLS·약점 분석 뷰.
-- 쓰기는 서버(service role)가 호출하는 RPC로만 한다 (20260924000000_progress_rpc.sql).

-- ─────────────────────────────── enums
create type public.problem_source as enum ('curated', 'generated');
create type public.problem_status as enum ('attempted', 'solved');
create type public.verdict as enum (
  'accepted', 'wrong-answer', 'runtime-error', 'time-limit-exceeded', 'syntax-error', 'internal-error'
);
create type public.generation_status as enum (
  'queued', 'generating', 'verifying', 'verified', 'rejected', 'failed'
);
create type public.coach_role as enum ('user', 'assistant');

-- ─────────────────────────────── helpers
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─────────────────────────────── profiles
create table public.profiles (
  id                 uuid primary key references auth.users (id) on delete cascade,
  nickname           text not null default '새싹 학습자' check (char_length(nickname) between 1 and 20),
  daily_goal_xp      integer not null default 30 check (daily_goal_xp between 10 and 500),
  theme              text not null default 'system' check (theme in ('light', 'dark', 'system')),
  editor_font_size   smallint not null default 14 check (editor_font_size between 12 and 22),
  preferred_language text not null default 'python' check (preferred_language in ('python', 'javascript')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ─────────────────────────────── stats & activity
create table public.user_stats (
  user_id          uuid primary key references public.profiles (id) on delete cascade,
  xp               integer not null default 0 check (xp >= 0),
  current_streak   integer not null default 0 check (current_streak >= 0),
  longest_streak   integer not null default 0 check (longest_streak >= 0),
  last_active_date date,
  -- 진도를 쓸 때마다 1씩 오른다. 서버가 읽은 뒤 계산한 값을 쓰기 전에 다른 요청이 끼어들었는지 확인 (낙관적 잠금)
  revision         bigint not null default 0,
  updated_at       timestamptz not null default now()
);
create trigger user_stats_set_updated_at
  before update on public.user_stats
  for each row execute function public.set_updated_at();

create table public.activity_days (
  user_id       uuid not null references public.profiles (id) on delete cascade,
  activity_date date not null,
  xp_earned     integer not null default 0 check (xp_earned >= 0),
  solved_count  integer not null default 0 check (solved_count >= 0),
  primary key (user_id, activity_date)
);

-- ─────────────────────────────── learning progress
create table public.concept_progress (
  user_id            uuid not null references public.profiles (id) on delete cascade,
  topic_slug         text not null,
  completed_card_ids text[] not null default '{}',
  completed_at       timestamptz,
  quiz_best_score    numeric(4, 3) check (quiz_best_score between 0 and 1),
  quiz_attempts      integer not null default 0 check (quiz_attempts >= 0),
  -- 만점으로 끝낸 퀴즈 수 ("유형 탐정" 배지)
  quiz_perfect_count integer not null default 0 check (quiz_perfect_count >= 0),
  updated_at         timestamptz not null default now(),
  primary key (user_id, topic_slug)
);
create trigger concept_progress_set_updated_at
  before update on public.concept_progress
  for each row execute function public.set_updated_at();

create table public.level_clears (
  user_id    uuid not null references public.profiles (id) on delete cascade,
  topic_slug text not null,
  level      smallint not null check (level between 1 and 5),
  cleared_at timestamptz not null default now(),
  primary key (user_id, topic_slug, level)
);

create table public.problem_progress (
  user_id         uuid not null references public.profiles (id) on delete cascade,
  problem_key     text not null check (problem_key ~ '^(c|g):.+$'),
  source          public.problem_source not null,
  topic_slug      text not null,
  level           smallint not null check (level between 1 and 5),
  status          public.problem_status not null default 'attempted',
  attempts        integer not null default 0 check (attempts >= 0),
  max_hint_opened smallint not null default 0 check (max_hint_opened between 0 and 4),
  last_code       text check (char_length(last_code) <= 20000),
  solved_at       timestamptz,
  best_runtime_ms integer check (best_runtime_ms >= 0),
  xp_awarded      integer not null default 0 check (xp_awarded >= 0),
  updated_at      timestamptz not null default now(),
  primary key (user_id, problem_key),
  constraint solved_has_timestamp check (status <> 'solved' or solved_at is not null)
);
create trigger problem_progress_set_updated_at
  before update on public.problem_progress
  for each row execute function public.set_updated_at();

create table public.submissions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles (id) on delete cascade,
  problem_key         text not null check (problem_key ~ '^(c|g):.+$'),
  source              public.problem_source not null,
  topic_slug          text not null,
  level               smallint not null check (level between 1 and 5),
  pattern_tags        text[] not null default '{}',
  language            text not null default 'python' check (language in ('python', 'javascript')),
  code                text not null check (char_length(code) <= 20000),
  verdict             public.verdict not null,
  passed              integer not null check (passed >= 0),
  total               integer not null check (total > 0),
  runtime_ms          integer check (runtime_ms >= 0),
  hints_opened        smallint not null default 0 check (hints_opened between 0 and 4),
  failed_test_case_id text,
  results             jsonb not null default '[]'::jsonb,
  created_at          timestamptz not null default now(),
  constraint passed_not_over_total check (passed <= total)
);
create index submissions_user_created_idx on public.submissions (user_id, created_at desc);
create index submissions_user_problem_idx on public.submissions (user_id, problem_key);

-- ─────────────────────────────── AI generated problems
create table public.generated_problems (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null references public.profiles (id) on delete cascade,
  status       public.generation_status not null default 'queued',
  topic_slug   text not null,
  level        smallint not null check (level between 2 and 5),
  request      jsonb not null,
  problem      jsonb,
  pattern_tags text[] not null default '{}',
  attempts     jsonb not null default '[]'::jsonb,
  model        text not null,
  error        text,
  created_at   timestamptz not null default now(),
  verified_at  timestamptz,
  -- 검증을 통과한 문제만 본문을 가진다
  constraint problem_only_when_verified check ((status = 'verified') = (problem is not null)),
  constraint verified_has_timestamp check (status <> 'verified' or verified_at is not null)
);
create index generated_problems_owner_created_idx on public.generated_problems (owner_id, created_at desc);

create table public.generated_problem_solutions (
  problem_id uuid primary key references public.generated_problems (id) on delete cascade,
  language   text not null default 'python' check (language = 'python'),
  code       text not null,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────── badges
create table public.badges (
  id          text primary key,
  name        text not null,
  description text not null,
  icon        text not null,
  sort_order  integer not null default 0
);

create table public.user_badges (
  user_id   uuid not null references public.profiles (id) on delete cascade,
  badge_id  text not null references public.badges (id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

-- ─────────────────────────────── AI coach
create table public.coach_messages (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  problem_key text not null check (problem_key ~ '^(c|g):.+$'),
  role        public.coach_role not null,
  content     text not null check (char_length(content) <= 8000),
  hint_level  smallint not null default 0 check (hint_level between 0 and 4),
  mood        text,
  created_at  timestamptz not null default now()
);
create index coach_messages_thread_idx on public.coach_messages (user_id, problem_key, created_at);

-- ─────────────────────────────── new user bootstrap
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nickname)
  values (
    new.id,
    coalesce(nullif(left(btrim(coalesce(new.raw_user_meta_data ->> 'name', '')), 20), ''), '새싹 학습자')
  );
  insert into public.user_stats (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────── row level security
alter table public.profiles                    enable row level security;
alter table public.user_stats                  enable row level security;
alter table public.activity_days               enable row level security;
alter table public.concept_progress            enable row level security;
alter table public.level_clears                enable row level security;
alter table public.problem_progress            enable row level security;
alter table public.submissions                 enable row level security;
alter table public.generated_problems          enable row level security;
alter table public.generated_problem_solutions enable row level security; -- 정책 없음 = service role 전용
alter table public.badges                      enable row level security;
alter table public.user_badges                 enable row level security;
alter table public.coach_messages              enable row level security;

create policy profiles_select_own on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy profiles_update_own on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy user_stats_select_own on public.user_stats
  for select to authenticated using ((select auth.uid()) = user_id);
create policy activity_days_select_own on public.activity_days
  for select to authenticated using ((select auth.uid()) = user_id);
create policy concept_progress_select_own on public.concept_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy level_clears_select_own on public.level_clears
  for select to authenticated using ((select auth.uid()) = user_id);
create policy problem_progress_select_own on public.problem_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy submissions_select_own on public.submissions
  for select to authenticated using ((select auth.uid()) = user_id);
create policy user_badges_select_own on public.user_badges
  for select to authenticated using ((select auth.uid()) = user_id);

create policy generated_problems_select_own on public.generated_problems
  for select to authenticated using ((select auth.uid()) = owner_id);

create policy badges_select_all on public.badges
  for select to anon, authenticated using (true);

create policy coach_messages_select_own on public.coach_messages
  for select to authenticated using ((select auth.uid()) = user_id);
create policy coach_messages_insert_own on public.coach_messages
  for insert to authenticated with check ((select auth.uid()) = user_id);

-- 프로필은 설정 항목만 직접 바꿀 수 있다 (id·가입일 등은 고정)
revoke update on public.profiles from anon, authenticated;
grant update (nickname, daily_goal_xp, theme, editor_font_size, preferred_language) on public.profiles to authenticated;

-- 정답 코드는 클라이언트 키로 절대 볼 수 없다 (RLS에 더해 권한 자체를 뺀다)
revoke all on public.generated_problem_solutions from anon, authenticated;

-- ─────────────────────────────── weakness analysis view
create view public.user_pattern_stats
with (security_invoker = true)
as
select
  s.user_id,
  tag                                                                  as pattern,
  count(distinct s.problem_key)                                        as problems_attempted,
  count(distinct s.problem_key) filter (where s.verdict = 'accepted')  as problems_solved,
  count(*)                                                             as submissions,
  count(*) filter (where s.verdict = 'accepted')                       as accepted_submissions,
  avg(s.hints_opened) filter (where s.verdict = 'accepted')            as avg_hints_on_accept,
  max(s.created_at)                                                    as last_attempt_at
from public.submissions s
cross join lateral unnest(s.pattern_tags) as tag
where s.verdict <> 'internal-error'
group by s.user_id, tag;
