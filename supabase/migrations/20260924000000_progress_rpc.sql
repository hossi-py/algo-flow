-- 진도 쓰기 RPC (Step 6).
--
-- XP·스트릭·레벨 클리어·배지 규칙은 콘텐츠(src/content)와 함께 TS(lib/progress)에 있다.
-- 서버(Route Handler)가 현재 진도를 읽어 규칙으로 새 값을 계산하고, 아래 RPC가 그 결과를
-- "한 트랜잭션"으로 기록한다. 읽은 뒤 다른 요청이 먼저 썼다면 revision이 달라 실패하고,
-- 서버가 다시 읽어 계산한다 (낙관적 잠금).
--
-- 모든 함수는 security definer이고 service role만 실행할 수 있다.
-- (클라이언트 키로 XP를 직접 써 넣지 못하게 하기 위해)
--
-- p_changes 형식 (모두 선택):
--   stats:        { xp, current_streak, longest_streak, last_active_date }
--   activity:     [{ activity_date, xp_earned, solved_count }]                  -- 값을 덮어쓴다
--   problems:     [{ problem_key, source, topic_slug, level, status, attempts,
--                    max_hint_opened, last_code, solved_at, best_runtime_ms, xp_awarded }]
--   concepts:     [{ topic_slug, completed_card_ids, completed_at, quiz_best_score,
--                    quiz_attempts, quiz_perfect_count }]
--   level_clears: [{ topic_slug, level, cleared_at }]                           -- 이미 있으면 그대로
--   badges:       [{ badge_id, earned_at }]                                     -- 이미 있으면 그대로

create or replace function public._claim_progress_revision(p_user_id uuid, p_expected_revision bigint)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_revision bigint;
begin
  update public.user_stats
     set revision = revision + 1
   where user_id = p_user_id
     and revision = p_expected_revision
  returning revision into v_revision;

  if v_revision is null then
    raise exception 'revision_conflict' using errcode = '40001';
  end if;
  return v_revision;
end;
$$;

create or replace function public._apply_progress_changes(p_user_id uuid, p_changes jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if jsonb_typeof(p_changes -> 'stats') = 'object' then
    update public.user_stats
       set xp               = (p_changes -> 'stats' ->> 'xp')::integer,
           current_streak   = (p_changes -> 'stats' ->> 'current_streak')::integer,
           longest_streak   = (p_changes -> 'stats' ->> 'longest_streak')::integer,
           last_active_date = (p_changes -> 'stats' ->> 'last_active_date')::date
     where user_id = p_user_id;
  end if;

  insert into public.activity_days (user_id, activity_date, xp_earned, solved_count)
  select p_user_id, a.activity_date, a.xp_earned, a.solved_count
    from jsonb_to_recordset(coalesce(p_changes -> 'activity', '[]'::jsonb))
         as a(activity_date date, xp_earned integer, solved_count integer)
  on conflict (user_id, activity_date) do update
     set xp_earned = excluded.xp_earned,
         solved_count = excluded.solved_count;

  insert into public.problem_progress (
    user_id, problem_key, source, topic_slug, level, status, attempts, max_hint_opened,
    last_code, solved_at, best_runtime_ms, xp_awarded
  )
  select p_user_id, p.problem_key, p.source, p.topic_slug, p.level, p.status, p.attempts, p.max_hint_opened,
         p.last_code, p.solved_at, p.best_runtime_ms, p.xp_awarded
    from jsonb_to_recordset(coalesce(p_changes -> 'problems', '[]'::jsonb))
         as p(problem_key text, source public.problem_source, topic_slug text, level smallint,
              status public.problem_status, attempts integer, max_hint_opened smallint, last_code text,
              solved_at timestamptz, best_runtime_ms integer, xp_awarded integer)
  on conflict (user_id, problem_key) do update
     set source          = excluded.source,
         topic_slug      = excluded.topic_slug,
         level           = excluded.level,
         status          = excluded.status,
         attempts        = excluded.attempts,
         max_hint_opened = excluded.max_hint_opened,
         last_code       = excluded.last_code,
         solved_at       = excluded.solved_at,
         best_runtime_ms = excluded.best_runtime_ms,
         xp_awarded      = excluded.xp_awarded;

  insert into public.concept_progress (
    user_id, topic_slug, completed_card_ids, completed_at, quiz_best_score, quiz_attempts, quiz_perfect_count
  )
  select p_user_id, c.topic_slug, coalesce(c.completed_card_ids, '{}'), c.completed_at, c.quiz_best_score,
         coalesce(c.quiz_attempts, 0), coalesce(c.quiz_perfect_count, 0)
    from jsonb_to_recordset(coalesce(p_changes -> 'concepts', '[]'::jsonb))
         as c(topic_slug text, completed_card_ids text[], completed_at timestamptz, quiz_best_score numeric,
              quiz_attempts integer, quiz_perfect_count integer)
  on conflict (user_id, topic_slug) do update
     set completed_card_ids = excluded.completed_card_ids,
         completed_at       = excluded.completed_at,
         quiz_best_score    = excluded.quiz_best_score,
         quiz_attempts      = excluded.quiz_attempts,
         quiz_perfect_count = excluded.quiz_perfect_count;

  insert into public.level_clears (user_id, topic_slug, level, cleared_at)
  select p_user_id, l.topic_slug, l.level, l.cleared_at
    from jsonb_to_recordset(coalesce(p_changes -> 'level_clears', '[]'::jsonb))
         as l(topic_slug text, level smallint, cleared_at timestamptz)
  on conflict (user_id, topic_slug, level) do nothing;

  insert into public.user_badges (user_id, badge_id, earned_at)
  select p_user_id, b.badge_id, b.earned_at
    from jsonb_to_recordset(coalesce(p_changes -> 'badges', '[]'::jsonb))
         as b(badge_id text, earned_at timestamptz)
  on conflict (user_id, badge_id) do nothing;
end;
$$;

create or replace function public._insert_submissions(p_user_id uuid, p_submissions jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.submissions (
    user_id, problem_key, source, topic_slug, level, pattern_tags, language, code, verdict,
    passed, total, runtime_ms, hints_opened, failed_test_case_id, results, created_at
  )
  select p_user_id, s.problem_key, s.source, s.topic_slug, s.level, coalesce(s.pattern_tags, '{}'), s.language,
         s.code, s.verdict, s.passed, s.total, s.runtime_ms, coalesce(s.hints_opened, 0), s.failed_test_case_id,
         coalesce(s.results, '[]'::jsonb), coalesce(s.created_at, now())
    from jsonb_to_recordset(coalesce(p_submissions, '[]'::jsonb))
         as s(problem_key text, source public.problem_source, topic_slug text, level smallint, pattern_tags text[],
              language text, code text, verdict public.verdict, passed integer, total integer, runtime_ms integer,
              hints_opened smallint, failed_test_case_id text, results jsonb, created_at timestamptz);
end;
$$;

/** 제출 1회: 제출 기록 + 문제 진도 + XP·스트릭·활동일 + 레벨 클리어 + 배지를 한 트랜잭션으로 */
create or replace function public.record_submission(
  p_user_id uuid,
  p_expected_revision bigint,
  p_submission jsonb,
  p_changes jsonb
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_revision bigint;
begin
  v_revision := public._claim_progress_revision(p_user_id, p_expected_revision);
  perform public._insert_submissions(p_user_id, jsonb_build_array(p_submission));
  perform public._apply_progress_changes(p_user_id, p_changes);
  return v_revision;
end;
$$;

/** 개념 카드 읽음 · 유형 인식 퀴즈 결과 */
create or replace function public.record_concept_progress(
  p_user_id uuid,
  p_expected_revision bigint,
  p_changes jsonb
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_revision bigint;
begin
  v_revision := public._claim_progress_revision(p_user_id, p_expected_revision);
  perform public._apply_progress_changes(p_user_id, p_changes);
  return v_revision;
end;
$$;

/** 힌트 열기 등 XP와 관계없는 문제 상태 변경 */
create or replace function public.record_problem_state(
  p_user_id uuid,
  p_expected_revision bigint,
  p_changes jsonb
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_revision bigint;
begin
  v_revision := public._claim_progress_revision(p_user_id, p_expected_revision);
  perform public._apply_progress_changes(p_user_id, p_changes);
  return v_revision;
end;
$$;

/** 게스트 진도 병합: 서버가 합친 결과(바뀐 행 전체)와 게스트 제출 기록을 한 번에 기록 */
create or replace function public.merge_guest_progress(
  p_user_id uuid,
  p_expected_revision bigint,
  p_changes jsonb,
  p_submissions jsonb
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_revision bigint;
begin
  v_revision := public._claim_progress_revision(p_user_id, p_expected_revision);
  perform public._apply_progress_changes(p_user_id, p_changes);
  perform public._insert_submissions(p_user_id, p_submissions);
  return v_revision;
end;
$$;

/** AI 생성 문제 검증 통과: 정답 코드(비공개)와 문제(공개부)를 함께 기록 */
create or replace function public.complete_generated_problem(
  p_id uuid,
  p_problem jsonb,
  p_attempts jsonb,
  p_solution text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.generated_problem_solutions (problem_id, code)
  values (p_id, p_solution)
  on conflict (problem_id) do update set code = excluded.code;

  update public.generated_problems
     set status       = 'verified',
         problem      = p_problem,
         pattern_tags = coalesce(array(select jsonb_array_elements_text(p_problem -> 'patternTags')), '{}'),
         attempts     = p_attempts,
         error        = null,
         verified_at  = now()
   where id = p_id;
end;
$$;

-- service role만 실행 (Supabase는 새 함수에 anon·authenticated 실행 권한을 기본으로 준다)
do $$
declare
  fn text;
begin
  foreach fn in array array[
    'public._claim_progress_revision(uuid, bigint)',
    'public._apply_progress_changes(uuid, jsonb)',
    'public._insert_submissions(uuid, jsonb)',
    'public.record_submission(uuid, bigint, jsonb, jsonb)',
    'public.record_concept_progress(uuid, bigint, jsonb)',
    'public.record_problem_state(uuid, bigint, jsonb)',
    'public.merge_guest_progress(uuid, bigint, jsonb, jsonb)',
    'public.complete_generated_problem(uuid, jsonb, jsonb, text)'
  ]
  loop
    execute format('revoke execute on function %s from public, anon, authenticated', fn);
    execute format('grant execute on function %s to service_role', fn);
  end loop;
end;
$$;
