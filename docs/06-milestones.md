# 06. 마일스톤

마일스톤 번호는 작업 Step 번호와 맞춘다. 각 마일스톤이 끝나면 멈추고 검토를 받는다.
**트랙 C(콘텐츠)** 는 코드와 별개로 진행되는 병행 트랙이다.

```
M1 설계 ─▶ M2 디자인 시스템·대시보드 ─▶ M3 워크스페이스·채점 ─▶ M4 시각화 ─▶ M5 AI ─▶ M6 인증·진도·약점 ─▶ M8 확장   (M7 코드 추적은 하지 않기로 함)
                                         └──── 트랙 C: 콘텐츠 제작 (M3 채점기 완성 후 시작, M6 전까지 MVP 분량 완료) ────┘
```

---

## M1. UX/UI & 아키텍처 설계 (Step 1) — 완료

| 구분 | 내용 |
| --- | --- |
| 목표 | 만들 것과 만드는 방식을 합의한다 |
| 산출물 | `docs/01`–`06` (디자인 시스템, 아키텍처·디렉토리, 화면·컴포넌트, 데이터 모델·SQL, 예시 문제, 마일스톤) |
| 완료 기준 | ☑ README의 결정 D1–D12 전부 확정 ☑ 컬러/마스코트 방향 승인 ☑ 데이터 모델 승인 |

## M2. 디자인 시스템 & 대시보드/로드맵 UI (Step 2) — 완료

| 구분 | 내용 |
| --- | --- |
| 목표 | 앱의 "첫인상"과 공통 부품을 완성한다. 백엔드 없이 게스트 진도(localStorage)로 동작 |
| 산출물 | 프로젝트 스캐폴딩(Next.js·TS·Tailwind v4·shadcn·motion·vitest·pnpm) · `globals.css` 토큰(라이트/다크) · 폰트 · `types/` · 공통 컴포넌트(PopButton, SoftCard, ProgressRing, XpPill, StreakFlame, TopicChip, LevelBadge, EmptyState, ThemeToggle, Celebration) · `Nodi` 8개 mood · AppShell(사이드바/하단탭) · 대시보드 · 로드맵 · 주제 홈 · `lib/progress`(xp, streak, unlock) · 7개 토픽 메타데이터 + 스택·DFS 샘플 콘텐츠 |
| 완료 기준 | ☑ `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test` 모두 통과 ☑ 375 / 768 / 1000 / 1280px 폭에서 가로 스크롤 없음 (768px: 대시보드·로드맵·주제 홈·개념 학습·마이페이지·AI 랩·문제 화면 브라우저 확인) ☑ 라이트·다크 전환 (토큰 대비는 계산값 AA 이상) ☑ `prefers-reduced-motion`에서 튀는 모션 비활성 ☑ unlock/xp/streak 단위 테스트(경계: 자정, 스트릭 리셋, 이전 토픽 Lv3) 통과 ☑ 게스트 진도가 새로고침 후 유지 |

## M3. 문제 풀이 워크스페이스 + 코드 실행/채점 (Step 3) — 검토 대기

| 구분 | 내용 |
| --- | --- |
| 목표 | 문제를 읽고, 코드를 쓰고, 실행·채점 받고, 힌트를 여는 핵심 루프 완성 |
| 산출물 | 3분할 리사이저블 레이아웃 + 모바일 탭 · Monaco(파스텔 테마 라이트/다크, JetBrains Mono) · 언어 선택(Python/JavaScript, 초안은 언어별 저장) · `public/workers/pyodide.worker.mjs`(module 워커, 번들 제외) · `js.worker.ts` · RunnerClient(대기 워커, 타임아웃, 재생성) · Python 하네스 · judge/compare · TestResultList · ConsoleOutput · VerdictBanner · HintStack · 코드 초안 자동 저장 · `scripts/validate-content.ts`(Node Pyodide) |
| 완료 기준 | ☑ 예시 문제(꽃밭 구역) 정답 코드 제출 → Python·JS 모두 12/12 AC (브라우저 확인) ☑ `while True: pass` / `while (true) {}` → 약 2.5초 후 TLE, 이어서 바로 재실행 가능 (JS 0.2초, Python 새 엔진 약 2.5초) ☑ 문법 오류 → syntax-error + 정확한 줄 번호 ☑ 대각선 연결 오답 → WA + 처음 틀린 케이스 입력/기대/실제 + failureNote 표시 (테스트) ☑ `print`/`console.log` 출력이 콘솔에 표시 ☑ 30×30 스트레스 케이스(재귀 깊이 900) 통과 ☑ 엔진 준비 후 예제 실행 응답 < 500ms ☑ 힌트는 순서대로만 열리고 XP 변화 안내 표시 ☑ `pnpm validate:content`가 Python·JS 정답 모두 expected 일치 확인 |

## M4. 시각화 엔진 (Step 4) — 검토 대기

| 구분 | 내용 |
| --- | --- |
| 목표 | 알고리즘 동작을 한 단계씩 "보면서" 이해시키기 |
| 산출물 | `player.ts`(재생 상태 머신) · Player/PlayerControls/StepMessage/PseudocodeView · StackView · QueueView · DequeView · SequenceView · GraphView · GridView · CallStackView · VariablesView · generators(stack-basic, stack-bracket, queue-basic, deque-basic, recursion-factorial, recursion-fibonacci, graph-adjacency, graph-dfs, graph-bfs, grid-dfs, grid-bfs, backtracking-permutation, backtracking-subset) · 토픽별 시각화 예시(`content/visualizations.ts`, 입력 직접 바꾸기) · 워크스페이스 시각화 패널 · **개념 학습 화면** `/topics/[topic]/learn`(ConceptCardDeck + ConceptIllustration 11종 · VisualizationExplorer · PatternSignalTrainer/RecognitionQuiz 형광펜 피드백) · `lib/progress/concept.ts`(카드 완독·퀴즈 통과 XP, Lv1 조건) · 스택·DFS 개념 카드와 퀴즈(트랙 C 선행분) |
| 완료 기준 | ☑ `grid-dfs` 출력이 05 문서의 33개 스텝 fixture와 정확히 일치 ☑ 모든 generator에 스냅샷 테스트 (프리셋 16개의 스텝 흐름 요약 스냅샷 + 번호·줄 번호·결정성 불변식 + 잘못된 입력 30종) ☑ 재생/일시정지/이전/다음/처음/끝/속도(0.5·1·2x)/스크럽 동작 ☑ 키보드(Space, ←, →) 조작 ☑ 스텝 이동 시 의사코드 줄 하이라이트 동기화 ☑ 색 외에 모양/라벨로도 상태 구분 (아이콘 + 스크린 리더 라벨, 그래프는 점선) ☑ 모바일 폭에서 SVG가 패널에 맞게 축소 (375px에서 가로 스크롤 없음) |
| 참고 | 개념 학습의 세 단계는 순서대로 안내하되 잠그지 않는다 — 주제 홈에서 `#visualize`·`#signals`로 바로 들어오고, 카드가 아직 없는 토픽도 시각화는 볼 수 있어야 해서. 카드는 화면에 0.6초 이상 머물러야 읽음으로 기록 |

## M5. AI 코치 & AI 문제 생성기 (Step 5) — 검토 대기

| 구분 | 내용 |
| --- | --- |
| 목표 | 정답을 주지 않고 "생각하게 만드는" 코치와, 검증된 맞춤 문제 공급 |
| 산출물 | 공식 Anthropic SDK + `claude-opus-5`(환경 변수로 교체, adaptive thinking, `fallbacks: "default"`) · `/api/coach`(NDJSON 스트리밍 + `coach_meta` 도구로 받는 CoachMeta) · 코치 프롬프트(힌트 단계별 정보 상한, 이미 연 힌트만 제공) · **스트리밍 가드**(solution 정의·코드 줄 수 초과 차단 → reset → 사유 붙여 재작성 → 두 번 막히면 대체 답변) · CoachPanel(노디 표정, 후속 질문, 힌트 추천, 게스트 대화 저장) · `/api/generate` + `/api/generate/[id]`(after()로 백그라운드 실행, 폴링) · `pipeline.ts`(스키마 → AST 정적 검사 → Node 실행으로 expected 계산 → 다른 해시 시드로 결정성 → 품질·힌트4 정답 여부·재채점 → 재생성 총 3회) · `runner-node`(worker_threads Pyodide, 환경 변수 비움, JS 브리지 차단, 타임아웃 시 워커 교체) · 정답 코드 읽기 경로가 없는 저장소(Step 5는 `.data/` 파일, Step 6에서 Supabase) · AI 랩 화면(토픽·레벨·집중 패턴·테마, 진행 단계, 내가 만든 문제) · 생성 문제 풀이 라우트 `/ai-lab/problems/[id]` · 개발용 모의 AI(`AI_MOCK=1`) · `pnpm ai:smoke` |
| 완료 기준 | ☑ 코치에게 "정답 코드 줘"라고 해도 전체 코드가 나오지 않음 — 가드 테스트 + 모의 AI로 브라우저 확인(유출 답변 차단 → 지우고 재작성) ◐ 힌트 2단계 사용자에게 의사코드 수준 정보가 나오지 않음 — 프롬프트 정보 상한 + 힌트 3 전 새 코드 2줄 제한은 동작, 글로 쓴 의사코드는 기계로 막지 못하므로 **실제 모델로 확인 필요** ☑ 코치 응답의 mood로 노디 표정 변경 (답변 말풍선·헤더 노디) ◐ 생성 10회 시도 중 검증 통과 문제가 모두 실제로 풀림 — 파이프라인 마지막 단계가 완성 문제를 정답 코드로 재채점해 AC일 때만 통과시키고, 테스트에서 JS 풀이로도 AC 확인. **실제 API 10회는 키 설정 후 `pnpm ai:smoke`로 확인 필요** ☑ 무한 루프 정답 코드가 섞이면 폐기·재생성 (테스트 + 브라우저: 1차 execution 탈락 → 2차 통과 기록) ☑ 정답 코드가 브라우저 네트워크 응답에 포함되지 않음 (저장소에 읽기 메서드 없음, 응답 본문 검사) ☑ 사용자당 일일 생성 한도(10개, 동시 1개) 동작 |
| 참고 | 로그인 전(Step 5)에는 httpOnly 게스트 쿠키로 사용 한도와 생성 문제 소유자를 구분한다. 문서의 "AI 랩은 로그인 사용자만"은 Step 6에서 Supabase가 설정된 경우에 적용한다 |

## M6. 인증, 진도 저장, 약점 분석 (Step 6) — 검토 대기

| 구분 | 내용 |
| --- | --- |
| 목표 | 학습 기록을 안전하게 저장하고, 약점을 AI 추천에 연결 |
| 산출물 | Supabase 마이그레이션 3개(스키마·RLS·뷰 / 진도 RPC / 배지) · `config.toml` · 로그인(이메일 로그인 링크 + 선택: Google/GitHub/Kakao, `/auth/login`, `/auth/callback`) · `proxy.ts` 세션 갱신 · `record_submission`/`record_concept_progress`/`record_problem_state`/`merge_guest_progress`/`complete_generated_problem` RPC(service role 전용, revision 낙관적 잠금) · 진도 API(`/api/progress`, submit·hint·concept·merge·submissions·weakness, `/api/profile`, `/api/coach/thread`) · 브라우저·서버 공통 규칙 `lib/progress/actions.ts`(+ `badges.ts`, `merge.ts`, `weakness.ts`, `rows.ts`, `service.ts`) · 게스트 → 계정 병합(AccountSync) · 게스트 제출 기록 저장 · 마이페이지(프로필·통계·12주 잔디·유형별 숙련도·배지·최근 제출과 코드 다시 보기·설정) · 대시보드 RecommendCard · AI 랩 약점 Top3 + 자동 패턴 선택 + 로그인 게이트 · 생성 문제 Supabase 저장소 |
| 완료 기준 | ☑ 다른 사용자 데이터가 RLS로 조회되지 않음 — PGlite(실제 Postgres)에 Supabase 역할·기본 권한을 흉내 내 마이그레이션을 적용하고 anon/타 계정으로 10개 테이블과 뷰를 검사 ☑ `generated_problem_solutions`는 클라이언트 키로 조회 불가 (본인 문제여도 permission denied) ☑ 게스트로 3문제 푼 뒤 로그인 → XP·진도·스트릭(·배지) 보존 — 병합 서비스를 DB에 실제로 기록해 확인, 이미 푼 문제는 XP 중복 없음 ☑ 제출 1회 = submission·progress·XP·스트릭·배지가 한 트랜잭션 — revision 충돌·제약 위반 시 제출 기록까지 되돌아감, 동시 제출 2건 모두 반영 ☑ 약점 Top3가 실제 제출 데이터와 일치 — DB 뷰 집계와 TS 집계가 같고 Top3 순서·점수 확인 ◐ 추천 → AI 문제 생성까지 한 흐름 — 대시보드·마이페이지 추천 링크가 토픽·패턴·신호를 채운 AI 랩으로 연결되고 폼에 자동 선택됨(브라우저 확인). **실제 Supabase 프로젝트와 로그인 메일 흐름은 키를 넣은 뒤 확인 필요** |
| 참고 | 로그인하지 않아도 모든 학습이 되고(게스트), 마이페이지·약점 분석도 이 브라우저 기록으로 보여 준다. 설정의 "게스트 데이터 가져오기"는 로그인 직후 자동 병합으로 대신했다 |

## 트랙 C. 콘텐츠 제작 (M3 이후 병행) — 최종 분량(105문제) 완료, 검토 대기

| 구분 | 내용 |
| --- | --- |
| 목표 | 7개 토픽 × 5레벨 학습 콘텐츠 |
| 토픽당 분량 | 개념 카드 4–6장 · 시각화 프리셋 2–3개 · 유형 신호 3–5개 · 유형 인식 퀴즈 5문항 · 문제 레벨당 2–3개 |
| 분량 | MVP 레벨당 2문제(70문제) → **최종 레벨당 3문제, 105문제 완료** |
| 제작 방식 | AI 생성기로 초안 → 사람이 검토·수정 → `validate-content`로 자동 검증 → PR 리뷰 |
| 산출물 | 문제 105개(7토픽 × 5레벨 × 3문제, `src/content/problems/<topic>/`) + Python·JS 모범 답안(`content-solutions/`) · 7개 토픽 개념 카드 5장씩과 유형 인식 퀴즈 5문항(`src/content/concepts/`) · 유형 신호 21개(토픽당 3–4개) · 문제 전용 시각화 프리셋(`problemPreset`) · `tests/content/concept-integrity.test.ts`(카드 수·퀴즈 5문항·정답 ∈ 보기·신호 id 존재·하이라이트 문구가 지문 안에 있는지·정답의 과반이 해당 토픽) |
| 완료 기준 | ☑ 모든 문제 `tsc` 타입 검사 + `validate-content` 통과 — 105문제의 Python·JS·Java 모범 답안이 모든 테스트(예제 2개 이상 + 숨김 4개 이상, 시간 초과를 잡는 큰 입력 포함)를 통과 ☑ 모든 문제에 4단계 힌트(유형 → 접근 → 의사코드 → 핵심 코드), 힌트4 코드에는 빈칸 `______`이 있어 전체 정답이 아님 — 테스트로 강제 ☑ 토픽별 퀴즈 정답 근거 문구 하이라이트 확인 — 하이라이트 문구가 지문에 그대로 있는지 테스트로 강제 ☑ 문제 저작권: 모든 문제가 오리지널 스토리·오리지널 예제 (N-Queen·물통처럼 널리 알려진 퍼즐은 이야기와 데이터를 새로 만들었다) |
| 참고 | 문제 난이도는 레벨 목표(예: DFS Lv4 "경로와 사이클", BFS Lv5 "상태 공간")에 맞췄다. 레벨당 3번째 문제 35개는 기존 두 문제와 겹치지 않는 유형·함정(예: 스택 Lv4 최솟값 스택, BFS Lv5 열쇠 상태)으로 골랐고, 각 토픽 추가 후 검토를 받았다 |

## 추가: 주력 언어 · Java 지원 — 검토 대기

| 구분 | 내용 |
| --- | --- |
| 목표 | 사용자가 고른 주력 언어로 문제를 시작하고, Python·JavaScript에 더해 Java로도 풀 수 있게 한다 |
| 산출물 | 설정의 **주력 언어**(프로필 `preferred_language`와 동기화) — 문제·개념 카드를 열면 주력 언어로 시작하고, 문제 화면에서 바꾼 언어는 그 화면에서만 쓰며 헤더의 "…를 주력 언어로" 버튼으로 바꿀 수 있다 · Java 실행기(CheerpJ 4.3 워커 + ECJ 3.26 + `java-runtime/src/algoflow` 하네스, `public/java/`) · 70문제 Java 시그니처·시작 코드·힌트4 코드·모범 답안(`content-solutions/**/*.java`) · 개념 카드 코드 예시 13개와 언어별 설명에 Java 추가 · 코치 가드가 Java `solution` 메서드·`class Solution`을 인식 · 마이그레이션 `20260925000000_java_language.sql` · `pnpm build:java`, `validate:content`의 Java 검증(JDK가 있을 때) |
| 완료 기준 | ☑ 105문제 Java 모범 답안이 진짜 JDK에서 모든 테스트 통과 (`validate:content`) ☑ 같은 105문제 답안이 브라우저 CheerpJ에서도 모두 통과 (나중에 더한 35문제 261케이스: 순수 실행 최대 0.17초, 입출력 포함 최대 0.8초), 순수 실행 최대 약 0.2초 (제한 2초) ☑ 주력 언어 Java → 문제·개념 카드가 Java로 열리고, 문제 화면에서 Python으로 바꿔도 주력 언어는 그대로 (브라우저 확인) ☑ Java 제출 → 정답 처리·진도 기록, 문법 오류는 줄 표시, 실행 오류는 쉬운 설명 ☑ AI 생성 문제는 Java 없이 Python·JS만 고를 수 있다 |
| 참고 | 브라우저 JVM은 재귀 깊이 약 2,000까지 안전해서 DFS 순환 찾기 문제의 큰 입력을 깊이 1,000 안쪽이 되게 간선 순서를 바꿨다. 런타임 예외에 줄 번호가 없어 발생 메서드 이름으로 안내한다. 큰 입력의 JSON 변환 시간 때문에 Java만 벽시계 제한에 4초 여유를 두고, 제한 시간 판정은 하네스가 잰 실행 시간으로 한다. CheerpJ는 상업 서비스에 쓰려면 라이선스가 필요하다 |

## M7. 사용자 코드 추적 시각화 — 하지 않기로 함

> 2026-09-26 결정: 진행하지 않는다. 미리 만든 시각화(M4)와 채점 결과의 첫 실패 케이스 안내로 대신한다. 아래는 당시 설계를 기록으로 남긴 것이다.

| 구분 | 내용 |
| --- | --- |
| 목표 | 미리 정의된 동작이 아니라 **사용자 코드 그 자체**의 실행을 시각화 |
| 산출물 | 하네스에 `sys.settrace` 기반 트레이서(라인·호출·반환 이벤트, 지역 변수 스냅샷) · 변수 → VizState 매핑 규칙(리스트 이름이 `stack`/`queue`/`visited`면 해당 뷰로) · 스텝 수 상한(예: 2,000)과 샘플링 · 에디터 줄 하이라이트 연동 |
| 완료 기준 | ☐ 사용자의 재귀 DFS 코드 실행 시 호출 스택·visited가 실제 코드대로 재생 ☐ 스텝 상한 초과 시 안내 후 앞부분만 재생 ☐ 추적 모드에서도 타임아웃 동작 |

## M8. 확장

| 구분 | 내용 |
| --- | --- |
| 목표 | 커리큘럼 확장 및 운영 품질 |
| 산출물 | 해시 · 정렬 · 이분 탐색 · DP 토픽 · Playwright E2E · 에러 모니터링 · 배포 파이프라인 · (선택) 서버 재채점, 랭킹 |
| 완료 기준 | ☐ 신규 토픽이 동일한 학습 흐름(개념 → 시각화 → 유형 인식 → 문제 → AI)으로 동작 ☑ 주요 사용자 흐름 E2E 통과 — `pnpm test:e2e` 14개(데스크톱 12 · 모바일 2): 대시보드 → 토픽 → 문제 길 찾기, 로드맵 잠금, 404, JS 정답 → XP·해결 수가 새로고침 후에도 유지, 오답의 첫 실패 케이스 표시, 무한 반복 → 시간 초과 후 재실행, Python 문법 오류 → 정답, 언어별 초안 저장, Java(CheerpJ) 정답, 힌트 순서·확인 창·유지, 개념 카드·시각화 스텝·유형 퀴즈, 모바일 가로 스크롤 없음·탭 전환 풀이 |
| 진행 | ☑ 에러 모니터링 — 외부 서비스 없이 자체 수집 (`instrumentation.ts` onRequestError · `instrumentation-client.ts` · `error.tsx`/`global-error.tsx` · 채점 엔진 로딩 실패 → `/api/errors` → Supabase `error_events`, 키가 없으면 서버 로그). 쿼리·이메일·토큰을 가리고 헤더는 저장하지 않음, IP당 하루 300건, service role 전용 + 지문별 묶어 보기 뷰 + 오래된 기록 정리 함수 |
| 진행 | ☑ 배포 파이프라인 — Vercel이 master를 자동 배포(PR은 미리보기), `vercel.json`으로 Next.js 빌드 고정. GitHub Actions CI(`ci.yml`): 타입·린트·포맷·단위 테스트(JDK 21)·콘텐츠 검증·E2E, PR에서 마이그레이션이 바뀌면 운영 DB 적용 경고. 배포 버전은 Vercel 커밋 해시로 에러 기록에 자동 기록 |
| 참고 | E2E는 게스트 흐름만 다룬다. AI 코치·문제 생성과 로그인은 키가 있어야 해서 단위 테스트(모의 AI, PGlite)로 확인한다 |
