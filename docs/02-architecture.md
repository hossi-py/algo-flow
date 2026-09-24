# 02. 시스템 아키텍처 & 디렉토리 구조

## 1. 전체 구조

```
┌──────────────────────────────── Browser ────────────────────────────────┐
│                                                                          │
│  Next.js App Router (RSC + Client Components)                            │
│   ├─ 콘텐츠 페이지 (RSC): 토픽/문제/개념 카드 ← src/content (정적, 타입 검증) │
│   ├─ Workspace (Client): Monaco · 힌트 · 시각화 · AI 코치                 │
│   │     │                                                                │
│   │     ├─ RunnerClient ──postMessage──▶ pyodide.worker.ts / js.worker.ts │
│   │     │     ▲  타임아웃 시 worker.terminate() → 새 워커 재생성           │
│   │     │     └──────────── 결과(JSON) ◀──────────────┘                   │
│   │     └─ Visualizer: VisualizationStep[] 재생 (React + SVG)             │
│   └─ Progress Store (zustand, 게스트는 localStorage 영속)                  │
│                                                                          │
└───────────────┬──────────────────────────────────────┬───────────────────┘
                │ fetch / stream                       │ supabase-js
                ▼                                      ▼
┌──────── Next.js Route Handlers (Node) ────────┐   ┌──────── Supabase ────────┐
│ /api/coach        AI 코치 (스트리밍)            │   │ Auth (이메일 매직링크/OAuth)│
│ /api/generate     AI 문제 생성 + 검증 파이프라인 │──▶│ Postgres + RLS            │
│   └─ NodeRunner: Pyodide(Node) in worker_thread │   │  progress, submissions,   │
│       정답 코드 실행 → expected 생성            │   │  generated_problems ...   │
│ @anthropic-ai/sdk ──▶ Claude (claude-opus-5)    │   │ RPC: record_submission    │
└─────────────────────────────────────────────────┘   └───────────────────────────┘
```

### 핵심 설계 결정

| # | 결정 | 이유 |
| --- | --- | --- |
| A1 | **큐레이션 콘텐츠는 저장소 안의 TS 파일**, DB에는 사용자 데이터와 AI 생성 문제만 저장 | 타입 검사·코드 리뷰·버전 관리가 가능하고, 콘텐츠 페이지를 정적으로 빌드할 수 있다. 문제는 `problemKey`(`c:<slug>` / `g:<uuid>`)로 DB와 연결. |
| A2 | **함수형 채점** (`solution(...)`의 반환값 비교, Python·JavaScript 공통) | 프로그래머스와 동일한 경험. 입력 파싱 부담이 없어 입문자 친화적이고, 인자/반환값이 JSON이라 시각화·AI 생성과 연결이 쉽다. |
| A3 | **유저 코드는 브라우저 워커**(Python = Pyodide, JavaScript = 전용 워커에서 직접 실행), **AI 생성 문제의 정답 코드는 서버 Pyodide(Node)** 에서 실행 | 정답 코드를 클라이언트에 절대 보내지 않고, 검증 결과를 사용자가 조작할 수 없다. 두 환경이 **같은 Python 하네스 코드**를 공유해 출력이 일치한다. |
| A4 | **타임아웃 = 워커 강제 종료 후 재생성** | Pyodide 실행 중엔 메인 스레드에서 중단할 방법이 제한적이다. `SharedArrayBuffer` 인터럽트는 COOP/COEP 헤더가 필요해 Monaco/CDN과 충돌 위험이 있으므로 MVP는 terminate 방식. 재생성 비용을 줄이려고 "대기 워커 1개"를 미리 띄워둔다. |
| A5 | **게스트 우선(Local-first)** | 로그인 없이 바로 학습 시작. 진도는 localStorage에 저장하고 로그인 시 서버로 병합. Step 2–5를 Supabase 없이 개발·검증할 수 있다. |
| A6 | **잠금/해제 상태는 저장하지 않고 계산** | DB에는 사실(푼 문제, 개념 완료, 레벨 클리어 시각)만 저장하고 `locked/available`은 규칙 함수로 계산. 콘텐츠 규칙을 바꿔도 데이터 마이그레이션이 필요 없다. |
| A7 | **시각화는 스냅샷 방식** (각 Step이 전체 상태를 가짐) | 이전/다음/스크럽이 인덱스 이동만으로 끝난다. 데이터가 작아(수십~수백 스텝) 메모리 부담 없음. |

> ⚠️ 알려진 한계: 채점이 클라이언트에서 이뤄지므로 숨은 테스트케이스는 기술적으로 열람 가능하고, 제출 결과를 조작할 수도 있다. 학습 앱 특성상 MVP에서는 수용한다. (랭킹/대회 기능을 넣는 시점에 서버 재채점 도입)

---

## 2. 코드 실행 엔진 설계 (Step 3 구현)

### 2.1 채점 흐름

```
[제출 클릭]
  → RunnerClient.judge(code, problem.testCases, judgeConfig)
      for each testCase:
        워커에 { type: "run-case", code, args, recursionLimit } 전송
        timeLimitMs 타이머 시작
          ├─ 응답 도착 → compare(actual, expected, mode) → AC / WA
          ├─ Python 예외 → RE (SyntaxError면 즉시 전체 중단: CE)
          └─ 타이머 만료 → worker.terminate(), 대기 워커로 교체 → TLE
  → JudgeResult { verdict, passed, total, results[] }
```

- **예제 실행(run)**: `visibility: "example"` 케이스만, 실제/기대 출력과 `print` 출력 모두 표시.
- **제출(submit)**: 전체 케이스. 숨은 케이스는 통과 여부만 표시하되, **처음 틀린 케이스 1개는 입력·기대값·실제값을 공개**(학습 목적. 문제별로 `revealFirstFailure: false` 설정 가능).
- 시간 초과가 한 번 나면 나머지 케이스는 같은 원인일 확률이 높으므로 "미실행"으로 표시하고 멈춘다(케이스마다 제한 시간 + 워커 재시작을 기다리지 않도록).
- 문법 오류는 첫 케이스에서 바로 드러나므로 전체를 syntax-error로 끝낸다.

### 2.2 언어별 하네스

**JavaScript** (`js.worker.ts`)
- 사용자 코드를 `new Function`으로 감싸 워커 전역과 분리된 스코프에서 평가하고, `solution` 함수 존재 확인.
- `console.log/info/warn/error`를 가로채 stdout으로 캡처(케이스당 최대 64KB).
- 인자는 `structuredClone`으로 복사해 전달.
- 반환값 정규화: `Set` → 정렬된 배열, `Map` → 객체, `undefined` → `null`, `NaN`/`Infinity`/`BigInt`/함수는 오류 처리.
- 동기 함수만 허용(`Promise` 반환 시 오류 안내). 스택 깊이는 엔진 기본값(V8 약 1만 프레임)으로, 재귀 깊이 1,000 이하 문제는 문제없음.
- Pyodide 로딩이 없어 워커 준비가 즉시 끝난다.

**Python** (`public/workers/pyodide.worker.mjs`, 서버 Node Pyodide와 하네스 공통)
- Turbopack은 워커를 classic 워커로 띄우고, Pyodide 314+는 module 워커에서만 동작한다. 그래서 Python 워커는 번들하지 않는 정적 module 워커로 두고, 하네스 코드(`src/lib/runner/harness-python.ts`)를 init 메시지로 넘긴다.
- 사용자 코드를 새 네임스페이스 `dict`에서 `exec` → `solution` 함수 존재 확인.
- `sys.stdout`을 `io.StringIO`로 교체해 `print` 캡처(케이스당 최대 64KB, 초과분 잘라냄).
- 인자는 JSON → Python 객체로 변환 후 **deepcopy**해서 전달(사용자가 인자를 변경해도 다음 케이스에 영향 없음).
- 반환값을 JSON 직렬화 가능한 형태로 정규화: `tuple → list`, `set → 정렬된 list`, `bool` 유지, `float('inf')`는 오류 처리.
- `sys.setrecursionlimit(judge.recursionLimit)` (기본 3000). 재귀 DFS 문제는 제약을 깊이 1,000 이하로 설계.
- 에러는 `{ type, message, line }`로 반환하고, 줄 번호는 사용자 코드 기준으로 보정.

**Java** (`public/workers/java.worker.js`, 하네스 소스 `java-runtime/src/algoflow`)
- CheerpJ 4.3(WebAssembly JVM, Java 11)을 classic 워커에서 `importScripts`로 불러오고, `cheerpjRunLibrary`로 하네스 jar와 ECJ jar를 한 클래스패스로 올린다 (워커당 한 번만 부를 수 있다).
- 컴파일: ECJ `-11`. CheerpJ 런타임에는 `lib/jrt-fs.jar`가 없어 ECJ가 시스템 라이브러리를 못 찾으므로, `/files/jdk`에 실행 중인 JVM과 같은 버전의 `release` 파일과 빈 `jrt-fs.jar`를 만들어 `--system`으로 넘긴다. 그러면 ECJ가 JVM 자체의 `jrt:/` 파일 시스템을 쓴다.
- 코드가 바뀔 때만 새 폴더(`/files/runN`)에 컴파일하고, 케이스마다 새 `URLClassLoader`로 불러온 `Solution`의 `solution` 메서드를 리플렉션으로 호출한다. 인자는 매개변수의 제네릭 타입을 보고 JSON에서 변환한다 (`int[]`, `int[][]`, `String[]`, `List<Integer>`, `long`, `Object[]` 등). 반환값은 배열·컬렉션·Map·박싱 타입을 JSON으로 바꾸고, 정수는 ±2^53 안이어야 한다.
- `System.out`/`err`는 케이스마다 64KB 버퍼로 바꿔 캡처한다.
- CheerpJ는 JS 스택 위에서 돌아 재귀 깊이 약 2,000까지 안전하다 (Java 모범 답안 70개를 브라우저에서 모두 돌려 확인). 스택이 넘치면 메시지 없는 `ArithmeticException`이 나서 이를 스택 초과로 바꿔 안내한다. 예외에 메시지·줄 번호가 없는 경우가 많아, 흔한 예외는 쉬운 설명과 발생 메서드 이름으로 채운다.
- 같은 하네스를 Node 검증(`scripts/java-tools.ts`, 진짜 JDK)에서도 쓴다. JVM과 CheerpJ는 속도가 달라 Node 검증은 정답 여부만 보고, 속도는 브라우저에서 따로 확인했다.

### 2.3 워커 메시지 프로토콜 (요약, 타입은 04 문서)
```
main → worker : init | run-case
worker → main : ready | init-error | case-result
```

---

## 3. AI 파이프라인 (Step 5 구현)

공통: 공식 Anthropic SDK(`@anthropic-ai/sdk`)로 Claude를 호출한다. 모델은 `AI_COACH_MODEL`·`AI_GENERATOR_MODEL`(기본 `claude-opus-5`), 적응형 사고(adaptive thinking), 안전 분류기가 거절하면 서버가 권장 모델로 다시 실행하는 `fallbacks: "default"`를 켠다. 규칙 프롬프트는 고정 문자열이라 프롬프트 캐시를 탄다. `AI_MOCK=1`(개발 전용)이면 키 없이 모의 응답으로 같은 흐름을 돌린다(`lib/ai/mock.ts`).

### 3.1 AI 코치 `/api/coach`
- 입력: 문제 키, 사용자 현재 코드, 열어본 힌트 단계(0–4), 최근 채점 요약(화면에 이미 공개된 정보만), 대화 이력(최근 10턴). **문제 본문은 클라이언트 값이 아니라 서버 원본**을 쓴다 (AI 생성 문제는 본인 것만).
- 프롬프트: 소크라테스식 질문 우선, 힌트 단계별 **정보 상한**(0: 유형 이름도 금지 · 1: 유형과 근거 · 2: 접근 아이디어까지, 의사코드 금지 · 3: 의사코드 흐름 · 4: 빈칸 있는 핵심 코드), 정답 전체 코드 금지. 이미 연 힌트만 컨텍스트에 넣는다.
- 출력: NDJSON 스트림 `text* → (reset → text*)? → meta → done`. 메타(`mood`, `suggestHintStep`, `followUps`)는 답변 뒤 strict 도구 `coach_meta` 호출로 받아 노디 표정·후속 질문·힌트 추천 버튼에 쓴다.
- **서버 가드**(`lib/ai/coach-guard.ts`): 스트리밍 중 코드 블록과 코드로 시작하는 줄은 모아서 검사한 뒤 내보낸다. `solution` 정의가 새로 나오거나(사용자의 머리줄 아래 새 본문 2줄 이상 포함), 사용자 코드에 없던 코드가 허용량(힌트 3 전 2줄, 이후 3줄)을 넘으면 차단 → 모델 요청을 끊고 `reset`을 보낸 뒤 사유를 붙여 한 번 다시 쓴다. 두 번 모두 막히면 준비된 질문형 답변으로 대신한다.
- 한도: 게스트 하루 30회(+ IP당 60회), 로그인 사용자 100회 (프로세스 메모리 카운터).

### 3.2 AI 문제 생성 `/api/generate`
```
POST(토픽, 레벨 2~5, 집중 패턴 ≤3, 약한 신호, 테마 ≤20자) → 202 { id }, 이후 GET /api/generate/[id] 폴링
after()에서:
  → [1] Claude 구조화 출력 (zod: ProblemDraft, 스트리밍). 잘리거나 JSON이 아니면 스키마 실패로 처리
  → [2] 스키마 검증 (argsJson 파싱, 인자 수 = params 수)
        + 정적 검사 (Pyodide ast: import 허용 목록, open/eval/exec/__import__/getattr 등 금지,
          던더 속성 금지, 최상위 solution 필요, 8,000자 이하)
  → [3] NodeRunner로 정답 코드 × 테스트 입력 전부 실행 → expected 계산
        (케이스당 500ms = 사용자 제한 2s의 1/4, 워커는 2s에 강제 종료, 합계 15s)
  → [4] 결정성: PYTHONHASHSEED가 다른 두 번째 워커로 다시 실행해 비교 (set·dict 순서 의존 검출)
  → [5] 품질: 예제 2~3, 숨은 ≥4, edge 케이스 포함, 기대값이 전부 같지 않음, 입력 중복 없음,
        제목·설명에 알고리즘 이름 금지, 힌트 4 코드가 그대로 정답이면 폐기,
        완성된 문제를 정답 코드로 다시 채점해 AC 확인
  → 실패 사유를 프롬프트에 붙여 재생성 (총 3회) → 모두 실패 시 rejected
  → 통과 시 문제(공개부)와 정답 코드(비공개)를 따로 저장, status = verified
```
- NodeRunner(`lib/runner-node`): Pyodide를 worker_threads로 띄우고(환경 변수 비움, 힙 512MB), 실행 코드가 JS 세계에 닿지 못하게 `js`·`pyodide` 모듈을 막는다. 실행은 직렬화해 시간 초과 종료가 다른 실행에 영향을 주지 않게 한다.
- 저장소(`lib/ai/store`)에는 정답 코드를 **읽는 메서드가 없다**. Step 5는 파일 저장소(`.data/`, 개발용), Step 6에서 Supabase(`generated_problems` / `generated_problem_solutions`)로 바뀐다.
- 사용자에게는 `verified` 문제만 풀이 화면을 연다. 진행 상태는 노디 `loading`과 단계 표시(문제 쓰는 중 → 정답 코드로 검증 중 → 완성), 재시도 중에는 "검증에서 떨어져서 다시 만들고 있어요 (2/3)"로 보여 준다. 10분 넘게 진행 중이면 중단된 것으로 본다.
- 한도: 사용자당 하루 10개, 동시에 1개.
- `pnpm ai:smoke [횟수]`: 실제 API로 생성 → 검증을 여러 번 돌려 통과율을 확인한다 (비용 발생).

---

## 4. 인증 · 진도 저장 (Step 6 구현)

```
[게스트]  브라우저가 lib/progress 규칙으로 진도 계산 → localStorage (진도 · 제출 기록 · 코치 대화)
[로그인]  브라우저: 같은 규칙으로 먼저 반영(낙관적)
             └─ POST /api/progress/{submit|hint|concept}
                  서버: 사용자 확인(getUser) → 현재 진도 읽기 → 같은 TS 규칙으로 새 진도 계산(+배지)
                        → 바뀐 행만 RPC 한 번 = 한 트랜잭션 (record_submission 등, service role 전용)
                        → revision이 달라졌으면(동시 요청) 다시 읽어 계산 (최대 3회)
             └─ 응답의 진도로 덮어씀 (요청은 순서대로 하나씩)
```

- **규칙은 한 곳**: XP·스트릭·레벨 클리어·배지 판단은 콘텐츠(`src/content`)가 있어야 하므로 SQL이 아니라 TS(`lib/progress/actions.ts`)에 두고, 게스트(브라우저)와 서버가 같은 함수를 쓴다. DB RPC는 계산된 결과를 원자적으로 기록만 한다.
- **쓰기 권한**: 진도 테이블에는 클라이언트 쓰기 정책이 없고, RPC 실행 권한도 service role에만 있다. 클라이언트 키로는 XP를 직접 쓸 수 없다. (채점이 브라우저에서 일어나는 한계는 §1 그대로)
- **로그인 직후 병합**: 이 브라우저에 게스트 진도가 있으면 `POST /api/progress/merge` → `mergeProgress`(문제별 해결 여부·시도 합산, 같은 문제·개념 XP는 한 번만, 활동일 합치고 스트릭 재계산) → `merge_guest_progress` RPC가 진도와 게스트 제출 기록을 한 번에 기록. 성공하면 게스트 기록을 비우고 새 계정에는 게스트 때 설정을 옮긴다.
- **로그아웃·세션 만료**: 화면의 진도를 빈 게스트 진도로 되돌린다 (다른 계정 진도가 남지 않게).
- **약점 분석**: 로그인은 `user_pattern_stats` 뷰(security_invoker), 게스트는 브라우저 제출 기록으로 같은 집계(`computePatternStats`)를 하고, 점수는 `weaknessScores` 하나로 계산한다. 대시보드 RecommendCard와 AI 랩 자동 패턴 선택이 이 결과를 쓴다.
- **AI 랩**: Supabase가 설정돼 있으면 로그인 사용자만 생성할 수 있고, 생성 문제는 `generated_problems`(공개부) / `generated_problem_solutions`(정답 코드, 클라이언트 권한 없음)에 저장한다. 코치 대화는 로그인 사용자면 `coach_messages`에도 남긴다.
- **설정이 없으면**: Supabase 환경 변수가 없으면 로그인 UI를 숨기고 게스트 모드로만 동작한다.

## 5. 디렉토리 구조

```
algo-flow/
├─ docs/                                  # 설계 문서 (본 문서들)
├─ public/
│  ├─ workers/pyodide.worker.mjs          # Python 실행 module 워커 (번들 제외)
│  ├─ favicon.svg                         # 노디 얼굴
│  └─ og.png
├─ scripts/
│  ├─ validate-content.ts                 # 큐레이션 문제 정답 코드를 NodeRunner로 실행해 expected 일치 검증 (CI)
│  └─ generate-viz-fixtures.ts            # 시각화 generator 스냅샷 생성 (테스트용)
├─ supabase/
│  ├─ config.toml
│  ├─ migrations/
│  │  └─ 20260923000000_init.sql          # 04 문서의 스키마
│  └─ seed.sql                            # 배지 등 정적 데이터
├─ content-solutions/                     # 큐레이션 문제 정답 코드(.py + .js). 클라이언트 번들에서 import 금지
│  └─ dfs/flower-zones.py, dfs/flower-zones.js
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                       # 폰트, ThemeProvider, MotionConfig, Toaster
│  │  ├─ globals.css                      # 디자인 토큰 (@theme inline)
│  │  ├─ (app)/                           # 사이드바/하단탭 셸을 쓰는 화면
│  │  │  ├─ layout.tsx                    # AppShell
│  │  │  ├─ page.tsx                      # 대시보드  /
│  │  │  ├─ roadmap/page.tsx              # 로드맵    /roadmap
│  │  │  ├─ topics/[topic]/page.tsx       # 주제 홈   /topics/dfs
│  │  │  ├─ topics/[topic]/learn/page.tsx # 개념 학습 /topics/dfs/learn
│  │  │  ├─ ai-lab/page.tsx               # AI 문제 생성 /ai-lab
│  │  │  └─ me/page.tsx                   # 마이페이지 /me
│  │  ├─ (workspace)/                     # 풀스크린 풀이 화면
│  │  │  ├─ layout.tsx                    # WorkspaceShell (얇은 상단바)
│  │  │  ├─ problems/[slug]/page.tsx      # 큐레이션 문제 /problems/dfs-flower-zones
│  │  │  └─ ai-lab/problems/[id]/page.tsx # AI 생성 문제 /ai-lab/problems/<uuid>
│  │  ├─ auth/
│  │  │  ├─ login/page.tsx
│  │  │  └─ callback/route.ts
│  │  └─ api/
│  │     ├─ coach/route.ts
│  │     ├─ generate/route.ts             # POST: 생성 요청
│  │     └─ generate/[id]/route.ts        # GET: 생성 상태 조회
│  ├─ components/
│  │  ├─ ui/                              # shadcn/ui 원본 (테마만 커스텀)
│  │  ├─ common/                          # PopButton, SoftCard, ProgressRing, XpPill, StreakFlame,
│  │  │                                   # TopicChip, LevelBadge, EmptyState, ThemeToggle, Celebration, Markdown
│  │  ├─ mascot/                          # Nodi.tsx, parts/, moods.ts, MascotBubble.tsx
│  │  ├─ layout/                          # AppShell, SideNav, BottomTabBar, TopBar, WorkspaceShell
│  │  ├─ dashboard/                       # GreetingHero, ContinueCard, DailyGoalCard, StatStrip, WeekActivity, RecommendCard
│  │  ├─ roadmap/                         # RoadmapPath, TopicNode, LevelSteps, LockTooltip
│  │  ├─ topic/                           # TopicHeader, LearningFlowStepper, LevelSection, ProblemListItem
│  │  ├─ learn/                           # ConceptCardDeck, ConceptIllustration, VisualizationExplorer,
│  │  │                                   # SignalCard, RecognitionQuiz
│  │  ├─ workspace/                       # Workspace, ResizableLayout, MobileTabs, ProblemPanel, HintStack,
│  │  │                                   # EditorPanel, CodeEditor, RunBar, ConsoleOutput, TestResultList, VerdictBanner
│  │  ├─ visualizer/                      # Player, PlayerControls, StepMessage, PseudocodeView,
│  │  │                                   # StackView, QueueView, DequeView, GraphView, GridView, CallStackView, VariablesView
│  │  ├─ coach/                           # CoachPanel, CoachMessage, CoachInput, SuggestedQuestions
│  │  ├─ ai-lab/                          # WeaknessSummary, GenerateForm, GenerationProgress, GeneratedProblemList
│  │  └─ me/                              # ProfileCard, StatsOverview, WeaknessChart, BadgeShelf, SubmissionHistory, SettingsForm
│  ├─ content/
│  │  ├─ topics/                          # index.ts + stack.ts, queue-deque.ts, recursion.ts, graph-representation.ts,
│  │  │                                   # dfs.ts, bfs.ts, backtracking.ts (Topic + ConceptLesson + Level)
│  │  ├─ problems/                        # index.ts + <topic>/<slug>.ts (Problem)
│  │  ├─ signals.ts                       # PatternSignal 전체 목록
│  │  └─ badges.ts
│  ├─ lib/
│  │  ├─ runner/
│  │  │  ├─ harness-python.ts             # Python 하네스 소스(문자열) — 브라우저/Node 공통
│  │  │  ├─ harness-js.ts                 # JS 실행·정규화 로직
│  │  │  ├─ protocol.ts                   # 워커 메시지 타입
│  │  │  ├─ client.ts                     # RunnerClient (워커 풀, 타임아웃, 재생성)
│  │  │  ├─ judge.ts                      # 케이스 순회, verdict 결정
│  │  │  └─ compare.ts                    # exact / unordered / float 비교
│  │  ├─ runner-node/                     # 서버 전용 ("server-only")
│  │  │  ├─ node-runner.ts
│  │  │  └─ node-worker.mjs               # worker_threads + Pyodide(Node)
│  │  ├─ visualization/
│  │  │  ├─ player.ts                     # 재생 상태 머신 (순수 함수)
│  │  │  └─ generators/                   # stack.ts, queue.ts, deque.ts, recursion.ts, graph-dfs.ts,
│  │  │                                   # graph-bfs.ts, grid-dfs.ts, grid-bfs.ts, backtracking.ts
│  │  ├─ ai/
│  │  │  ├─ schemas.ts                    # zod: ProblemDraft, CoachMeta, 코치·생성 요청 본문
│  │  │  ├─ client.ts                     # (server-only) Anthropic 클라이언트, 모델·effort, fallbacks
│  │  │  ├─ prompts/coach.ts              # 코치 규칙 + 힌트 단계별 정보 상한 + coach_meta 도구
│  │  │  ├─ prompts/generator.ts          # 출제 규칙 + 스타일 예시 + 재생성 사유
│  │  │  ├─ coach.ts / coach-guard.ts     # 가드를 통과시키며 스트리밍, 막히면 재작성
│  │  │  ├─ coach-claude.ts               # (server-only) 코치 모델 호출
│  │  │  ├─ generator.ts                  # (server-only) 구조화 출력으로 초안 받기
│  │  │  ├─ static-check.ts               # 정답 코드 AST 정적 검사 (Python)
│  │  │  ├─ build-problem.ts              # 초안 + 실행 결과 → Problem
│  │  │  ├─ pipeline.ts                   # 생성 → 검증 → 재시도 (의존성 주입, 테스트 가능)
│  │  │  ├─ jobs.ts                       # (server-only) after()에서 파이프라인 실행·상태 저장
│  │  │  ├─ store/                        # 생성 문제 저장소 (정답 코드는 쓰기만 가능)
│  │  │  └─ mock.ts, mock-draft.ts        # 개발용 모의 AI (AI_MOCK=1)
│  │  ├─ server/                          # requester.ts (게스트 쿠키 / 로그인 사용자), rate-limit.ts
│  │  ├─ progress/
│  │  │  ├─ xp.ts                         # XP 계산, 사용자 레벨
│  │  │  ├─ streak.ts                     # KST 기준 스트릭
│  │  │  ├─ unlock.ts                     # 토픽/레벨 잠금 계산
│  │  │  ├─ badges.ts                     # 배지 판정
│  │  │  └─ weakness.ts                   # 패턴별 약점 점수
│  │  ├─ supabase/                        # env.ts, client.ts(브라우저), server.ts(세션·getAuthUser), admin.ts(서비스 키), proxy.ts
│  │  ├─ motion.ts                        # spring/duration 프리셋
│  │  └─ utils.ts                         # cn() 등
│  ├─ workers/
│  │  └─ js.worker.ts                  # (Python 워커는 public/workers/pyodide.worker.mjs)
│  ├─ stores/
│  │  ├─ progress-store.ts                # 게스트 진도 (persist)
│  │  ├─ workspace-store.ts               # 문제별 코드 초안, 열린 힌트, 실행 결과
│  │  └─ settings-store.ts                # 에디터 글꼴 크기, 패널 비율
│  ├─ hooks/                              # use-runner.ts, use-player.ts, use-breakpoint.ts, use-celebration.ts
│  ├─ types/                              # common.ts, content.ts, judge.ts, visualization.ts, progress.ts, ai.ts
│  └─ proxy.ts                            # Supabase 세션 갱신 (Next 16: middleware → proxy)
├─ tests/                                 # vitest: compare, judge, unlock, streak, xp, generators
├─ .env.example
├─ components.json                        # shadcn 설정
├─ next.config.ts
├─ package.json                           # pnpm
└─ tsconfig.json
```

### 주요 의존성 (Step 2 착수 시 버전 고정)
| 영역 | 패키지 |
| --- | --- |
| 프레임워크 | `next`, `react`, `react-dom`, `typescript` |
| 스타일 | `tailwindcss` v4, `shadcn` (CLI), `class-variance-authority`, `tailwind-merge`, `lucide-react`, `next-themes` |
| 모션 | `motion` (Framer Motion) |
| 폰트 | `pretendard` (로컬), `next/font/google`(JetBrains Mono) |
| 레이아웃 | `react-resizable-panels` (shadcn `Resizable`) |
| 에디터 | `@monaco-editor/react` |
| 실행 | `pyodide` (브라우저는 CDN 로드, Node는 npm 패키지). JavaScript는 추가 의존성 없음. Java는 CheerpJ 4.3(CDN) + ECJ 3.26(`public/java/ecj.jar`) |
| 상태 | `zustand` |
| AI | `@anthropic-ai/sdk` (공식 SDK, Step 5 확정), `zod` |
| DB | `@supabase/supabase-js`, `@supabase/ssr` |
| 마크다운 | `react-markdown`, `remark-gfm` |
| 테스트 | `vitest`, `@testing-library/react` |
