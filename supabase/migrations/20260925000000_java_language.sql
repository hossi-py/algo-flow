-- Java 풀이 언어 추가: 주력 언어와 제출 기록에 'java'를 허용한다.
-- (AI 생성 문제의 정답 코드는 계속 Python만 저장한다)

alter table public.profiles drop constraint if exists profiles_preferred_language_check;
alter table public.profiles
  add constraint profiles_preferred_language_check check (preferred_language in ('python', 'javascript', 'java'));

alter table public.submissions drop constraint if exists submissions_language_check;
alter table public.submissions
  add constraint submissions_language_check check (language in ('python', 'javascript', 'java'));
