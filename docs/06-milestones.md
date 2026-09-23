# 06. 마일스톤

마일스톤 번호는 작업 Step 번호와 맞춘다. 각 마일스톤이 끝나면 멈추고 검토를 받는다.
**트랙 C(콘텐츠)** 는 코드와 별개로 진행되는 병행 트랙이다.

```
M1 설계 ─▶ M2 디자인 시스템·대시보드 ─▶ M3 워크스페이스·채점 ─▶ M4 시각화 ─▶ M5 AI ─▶ M6 인증·진도·약점 ─▶ M7 코드 추적 ─▶ M8 확장
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
| 완료 기준 | ☑ `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test` 모두 통과 ☑ 375 / 1000 / 1280px 폭에서 가로 스크롤 없음 (768px는 사용자 확인 필요) ☑ 라이트·다크 전환 (토큰 대비는 계산값 AA 이상) ☑ `prefers-reduced-motion`에서 튀는 모션 비활성 ☑ unlock/xp/streak 단위 테스트(경계: 자정, 스트릭 리셋, 이전 토픽 Lv3) 통과 ☑ 게스트 진도가 새로고침 후 유지 |

## M3. 문제 풀이 워크스페이스 + 코드 실행/채점 (Step 3) — 검토 대기

| 구분 | 내용 |
| --- | --- |
| 목표 | 문제를 읽고, 코드를 쓰고, 실행·채점 받고, 힌트를 여는 핵심 루프 완성 |
| 산출물 | 3분할 리사이저블 레이아웃 + 모바일 탭 · Monaco(파스텔 테마 라이트/다크, JetBrains Mono) · 언어 선택(Python/JavaScript, 초안은 언어별 저장) · `public/workers/pyodide.worker.mjs`(module 워커, 번들 제외) · `js.worker.ts` · RunnerClient(대기 워커, 타임아웃, 재생성) · Python 하네스 · judge/compare · TestResultList · ConsoleOutput · VerdictBanner · HintStack · 코드 초안 자동 저장 · `scripts/validate-content.ts`(Node Pyodide) |
| 완료 기준 | ☑ 예시 문제(꽃밭 구역) 정답 코드 제출 → Python·JS 모두 12/12 AC (브라우저 확인) ☑ `while True: pass` / `while (true) {}` → 약 2.5초 후 TLE, 이어서 바로 재실행 가능 (JS 0.2초, Python 새 엔진 약 2.5초) ☑ 문법 오류 → syntax-error + 정확한 줄 번호 ☑ 대각선 연결 오답 → WA + 처음 틀린 케이스 입력/기대/실제 + failureNote 표시 (테스트) ☑ `print`/`console.log` 출력이 콘솔에 표시 ☑ 30×30 스트레스 케이스(재귀 깊이 900) 통과 ☑ 엔진 준비 후 예제 실행 응답 < 500ms ☑ 힌트는 순서대로만 열리고 XP 변화 안내 표시 ☑ `pnpm validate:content`가 Python·JS 정답 모두 expected 일치 확인 |

## M4. 시각화 엔진 (Step 4)

| 구분 | 내용 |
| --- | --- |
| 목표 | 알고리즘 동작을 한 단계씩 "보면서" 이해시키기 |
| 산출물 | `player.ts`(재생 상태 머신) · Player/PlayerControls/StepMessage/PseudocodeView · StackView · QueueView · DequeView · GraphView · GridView · CallStackView · VariablesView · generators(stack-basic, stack-bracket, queue-basic, deque-basic, recursion-factorial, recursion-fibonacci, graph-adjacency, graph-dfs, graph-bfs, grid-dfs, grid-bfs, backtracking-permutation, backtracking-subset) · 개념 학습 화면의 VisualizationExplorer |
| 완료 기준 | ☐ `grid-dfs` 출력이 05 문서의 33개 스텝 fixture와 정확히 일치 ☐ 모든 generator에 스냅샷 테스트 ☐ 재생/일시정지/이전/다음/처음/끝/속도(0.5·1·2x)/스크럽 동작 ☐ 키보드(Space, ←, →) 조작 ☐ 스텝 이동 시 의사코드 줄 하이라이트 동기화 ☐ 색 외에 모양/라벨로도 상태 구분 ☐ 모바일 폭에서 SVG가 패널에 맞게 축소 |

## M5. AI 코치 & AI 문제 생성기 (Step 5)

| 구분 | 내용 |
| --- | --- |
| 목표 | 정답을 주지 않고 "생각하게 만드는" 코치와, 검증된 맞춤 문제 공급 |
| 산출물 | `/api/coach`(스트리밍 + CoachMeta) · 코치 시스템 프롬프트(힌트 단계별 정보 상한) · CoachPanel · `/api/generate` + `pipeline.ts`(생성 → 스키마 → 정적 검사 → Node 실행 → 결정성 → 품질 → 재시도 3회) · AI 랩 화면 · 생성 문제 풀이 라우트 |
| 완료 기준 | ☐ 코치에게 "정답 코드 줘"라고 해도 전체 코드가 나오지 않음(서버 가드 포함) ☐ 힌트 2단계 사용자에게 의사코드 수준 정보가 나오지 않음 ☐ 코치 응답의 mood로 노디 표정 변경 ☐ 생성 10회 시도 중 검증 통과 문제가 모두 실제로 풀림(정답 코드 제출 시 AC) ☐ 무한 루프 정답 코드가 섞이면 폐기·재생성 로그 확인 ☐ 정답 코드가 브라우저 네트워크 응답에 절대 포함되지 않음 ☐ 사용자당 일일 생성 한도 동작 |

## M6. 인증, 진도 저장, 약점 분석 (Step 6)

| 구분 | 내용 |
| --- | --- |
| 목표 | 학습 기록을 안전하게 저장하고, 약점을 AI 추천에 연결 |
| 산출물 | Supabase 마이그레이션 적용 · 로그인(이메일 매직링크 + 선택: Google/GitHub/Kakao) · `record_submission`/`record_concept_progress`/`merge_guest_progress` RPC · 게스트 → 계정 병합 · 마이페이지(통계, 잔디, 약점 차트, 배지, 제출 기록) · `weakness.ts` · 대시보드 RecommendCard / AI 랩 자동 패턴 선택 |
| 완료 기준 | ☐ 다른 사용자 데이터가 RLS로 조회되지 않음(anon/타 계정 테스트) ☐ `generated_problem_solutions`는 클라이언트 키로 조회 불가 ☐ 게스트로 3문제 푼 뒤 로그인 → XP·진도·스트릭 보존 ☐ 제출 1회 = submission·progress·XP·스트릭·배지가 한 트랜잭션으로 갱신 ☐ 약점 Top3가 실제 제출 데이터와 일치 ☐ 추천 → AI 문제 생성까지 한 흐름으로 동작 |

## 트랙 C. 콘텐츠 제작 (M3 이후 병행)

| 구분 | 내용 |
| --- | --- |
| 목표 | 7개 토픽 × 5레벨 학습 콘텐츠 |
| 토픽당 분량 | 개념 카드 4–6장 · 시각화 프리셋 2–3개 · 유형 신호 3–5개 · 유형 인식 퀴즈 5문항 · 문제 레벨당 2–3개 |
| MVP 분량 | 레벨당 2문제 → **70문제** (최종 목표 레벨당 3문제 → 105문제) |
| 제작 방식 | AI 생성기로 초안 → 사람이 검토·수정 → `validate-content`로 자동 검증 → PR 리뷰 |
| 완료 기준 | ☐ 모든 문제 `tsc` 타입 검사 + `validate-content` 통과 ☐ 모든 문제에 4단계 힌트, 힌트4가 전체 정답이 아님(리뷰 체크) ☐ 토픽별 퀴즈 정답 근거 문구 하이라이트 확인 ☐ 문제 저작권: 기존 사이트 문제 복제 금지, 전부 오리지널 스토리 |

## M7. 사용자 코드 추적 시각화 (후반)

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
| 완료 기준 | ☐ 신규 토픽이 동일한 학습 흐름(개념 → 시각화 → 유형 인식 → 문제 → AI)으로 동작 ☐ 주요 사용자 흐름 E2E 통과 |
