-- 배지 정의 (src/content/badges.ts와 같다). user_badges가 참조하므로 시드가 아니라 마이그레이션으로 넣는다.
insert into public.badges (id, name, description, icon, sort_order) values
  ('first-accept',     '첫 새싹',       '첫 문제를 맞혔어요',                          'sprout',     1),
  ('no-hint-lv3',      '혼자서도 척척', 'Lv3 이상 문제를 힌트 없이 풀었어요',          'sparkles',   2),
  ('streak-3',         '사흘의 약속',   '3일 연속으로 학습했어요',                      'flame',      3),
  ('streak-7',         '일주일 개근',   '7일 연속으로 학습했어요',                      'flame-2',    4),
  ('streak-30',        '한 달의 숲',    '30일 연속으로 학습했어요',                     'trees',      5),
  ('topic-master',     '토픽 마스터',   '한 토픽의 Lv5를 클리어했어요',                 'crown',      6),
  ('signal-detective', '유형 탐정',     '유형 인식 퀴즈를 만점으로 5번 통과했어요',     'search',     7),
  ('ai-pioneer',       'AI 개척자',     'AI가 만든 맞춤 문제를 처음 풀었어요',          'wand',       8),
  ('never-give-up',    '끈기왕',        '5번 이상 도전한 끝에 정답을 맞혔어요',         'mountain',   9)
on conflict (id) do update
  set name = excluded.name,
      description = excluded.description,
      icon = excluded.icon,
      sort_order = excluded.sort_order;
