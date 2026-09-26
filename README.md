# algo-flow

스택부터 백트래킹까지, 알고리즘을 쉬운 단계부터 순서대로 배우는 학습 플랫폼. 마스코트는 새싹 노드 **노디** 🌱

- 설계 문서: [docs/README.md](docs/README.md)
- 지원 언어: Python, JavaScript, Java (Java는 큐레이션 문제만. 설정의 **주력 언어**로 문제를 열 때의 기본 언어를 정해요)

## 실행

Node.js 22.13 이상이 필요합니다 (`packageManager`로 고정한 pnpm 11의 요구 사항).

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

로그인 없이 바로 쓸 수 있고, 진도는 이 브라우저(localStorage)에 저장됩니다. Supabase를 연결하면 로그인해서 기기 사이에 진도를 이어 갈 수 있습니다.

### 환경 변수

`.env.example`을 `.env.local`로 복사해 채웁니다. 비워 두면 해당 기능만 꺼지고 화면에 안내가 나옵니다.

| 변수                                                                | 용도                                                                                      |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY`                                                 | AI 코치 · AI 맞춤 문제 생성                                                               |
| `AI_COACH_MODEL` / `AI_GENERATOR_MODEL`                             | 모델 ID (기본 `claude-opus-5`)                                                            |
| `AI_MOCK=1`                                                         | 개발 전용 모의 AI. 키 없이 코치 스트리밍·가드 재작성, 생성 → 검증 실패 → 재생성 흐름 확인 |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | 로그인 · 진도 저장 (없으면 게스트 모드만)                                                 |
| `SUPABASE_SERVICE_ROLE_KEY`                                         | 서버 전용. 진도 기록 RPC · AI 생성 문제 저장                                              |
| `NEXT_PUBLIC_AUTH_PROVIDERS`                                        | 로그인 화면의 소셜 로그인 (`google,github,kakao` 중 켠 것)                                |
| `NEXT_PUBLIC_RELEASE`                                               | 선택. 배포 버전. 비우면 Vercel 커밋 해시를 자동으로 써요. 에러 기록에 함께 남아요         |

### Supabase 연결

1. Supabase 프로젝트를 만들고 `supabase/migrations/`를 순서대로 적용합니다 (`supabase link` → `supabase db push`, 또는 SQL 편집기에 파일 순서대로 붙여 넣기).
2. Authentication → URL Configuration에 `http://localhost:3000/auth/callback`(배포 주소도)을 Redirect URL로 추가합니다.
3. 소셜 로그인을 쓰려면 대시보드에서 제공자를 켜고 `NEXT_PUBLIC_AUTH_PROVIDERS`에 적습니다.
4. 위 환경 변수 세 개를 넣고 다시 실행합니다. 게스트로 쌓은 진도는 첫 로그인 때 계정으로 옮겨집니다.

## 명령

| 명령                        | 설명                                                                                                                                                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`                  | 개발 서버                                                                                                                                                                                                            |
| `pnpm build` / `pnpm start` | 프로덕션 빌드 / 실행                                                                                                                                                                                                 |
| `pnpm typecheck`            | 라우트 타입 생성 + `tsc`                                                                                                                                                                                             |
| `pnpm lint`                 | ESLint                                                                                                                                                                                                               |
| `pnpm test`                 | Vitest (진도 규칙, 채점기, JS·Python 하네스, 시각화, 개념 학습 화면, AI 코치 가드·문제 생성 파이프라인·서버 Python 러너, PGlite로 마이그레이션·RLS·진도 RPC 검증 등)                                                 |
| `pnpm test:e2e`             | Playwright E2E. 프로덕션 빌드를 3100번 포트에 띄워 게스트 흐름(길 찾기, Python·JS·Java 채점, 힌트, 개념 학습, 모바일)을 확인. 처음엔 `pnpm exec playwright install chromium` 필요, 엔진을 CDN에서 받아 네트워크 필요 |
| `pnpm validate:content`     | 모든 문제의 Python·JS 정답 코드를 실제 하네스로 실행해 기대값 검증 (Pyodide). `JAVA_HOME`에 JDK 11+가 있으면 Java 정답도 같은 Java 하네스로 검증                                                                     |
| `pnpm build:java`           | Java 채점 하네스(`java-runtime/src`)를 `public/java/algoflow-runner.jar`로 빌드 (JDK 11+ 필요, 결과 jar는 커밋)                                                                                                      |
| `pnpm ai:smoke [횟수]`      | 실제 Claude API로 AI 문제를 여러 번(기본 10회) 생성·검증해 통과율 확인 (API 비용 발생)                                                                                                                               |
| `pnpm format`               | Prettier                                                                                                                                                                                                             |

개발 서버에서는 화면 오른쪽 아래 🔧 버튼(개발용 도구)으로 예시 진도 불러오기 · XP 추가 · 축하 연출 · 진도 초기화를 할 수 있습니다. 프로덕션 빌드에는 나타나지 않습니다.

## 관리자 화면

`/admin`에서 운영 현황(지표 6개와 지난주 대비 변화, 최근 14일 가입·활동·제출 추이, 최근 에러)과 회원 목록·검색·상세(진도, 최근 제출, 배지, AI 사용량)를 볼 수 있어요. 읽기 전용이고, 회원의 코드와 AI 코치 대화 내용은 보여 주지 않아요.

마이그레이션 `20260926000001_admin.sql`, `20260926000002_admin_overview_weekly.sql`(지난주 대비 변화)을 적용해야 해요. 둘 다 여러 번 실행해도 안전해요.

관리자는 `admins` 테이블에 등록된 계정뿐이에요. 로그인한 뒤 Supabase SQL Editor에서 한 번 등록해요.

```sql
insert into public.admins (user_id, note)
select id, 운영자 from auth.users where email = 내-이메일@example.com;
```

관리자가 아니면 `/admin`은 없는 주소와 똑같은 404(탭 제목까지 같음)를 보여 줘서 관리자 화면이 있다는 것도 드러나지 않아요. 관리자에게는 마이페이지에 "관리자 화면" 링크가 보여요.

## CI · 배포

- **CI** (`.github/workflows/ci.yml`): PR과 `master` 푸시마다 GitHub Actions가 타입 검사 · 린트 · 포맷 · 단위 테스트(JDK 21 포함) · 콘텐츠 검증 · Playwright E2E를 돌려요. PR에서 `supabase/migrations/`가 바뀌면 운영 DB에 적용하라는 경고를 남겨요.
- **배포**: Vercel이 `master`를 받아 자동으로 배포하고, PR마다 미리보기 배포를 만들어요. `vercel.json`으로 Next.js 빌드를 고정해 두었어요.
- **마이그레이션**: 배포만으로는 DB가 바뀌지 않아요. 새 마이그레이션은 Supabase SQL Editor(또는 `supabase db push`)로 직접 적용해요.
- **배포 버전**: Vercel 빌드에서는 커밋 해시 앞 7자리가 자동으로 `NEXT_PUBLIC_RELEASE`가 되어 에러 기록에 남아요.

## 에러 모니터링

외부 서비스 없이 에러를 직접 모아요. Supabase가 연결돼 있으면 `error_events` 테이블에 저장하고, 없으면 서버 로그에 `[error:출처] {…}` 한 줄로만 남겨요.

- **server**: `src/instrumentation.ts`의 `onRequestError`가 서버 컴포넌트·Route Handler·Server Action·Proxy 에러를 기록해요.
- **client**: `src/instrumentation-client.ts`가 처리되지 않은 브라우저 에러·Promise 거부를 `/api/errors`로 보내요. 같은 에러는 페이지당 한 번, 최대 10건이고 확장 프로그램·ResizeObserver 같은 잡음은 뺍니다.
- **boundary**: 화면이 깨졌을 때 뜨는 `error.tsx`·`global-error.tsx`가 보내요. 서버 에러와 같은 `digest`로 이어져요.
- **engine**: 채점 엔진(Pyodide·CheerpJ)이 CDN에서 로딩에 실패하거나 멈추면 보내요.

저장 전에 길이를 자르고 주소의 쿼리, 이메일, 토큰(`token=…`, JWT, API 키)을 가려요. 요청 헤더·쿠키는 저장하지 않아요. `/api/errors`는 IP마다 하루 300건까지 받아요.

`error_events`와 묶어 보기 뷰 `error_groups`는 service role만 읽을 수 있어요 (Supabase 대시보드 SQL 편집기에서 `select * from error_groups order by last_seen desc;`). 오래된 기록은 `select public.prune_error_events(30);`로 지워요 (Supabase Cron에 매일 등록 권장).

## Java 실행 (브라우저)

Java 코드는 서버 없이 브라우저에서 실행해요. [CheerpJ](https://cheerpj.com/)(WebAssembly JVM, Java 11)가 워커(`public/workers/java.worker.js`)에서 돌고, [Eclipse 컴파일러(ECJ) 3.26](https://github.com/eclipse-jdt/eclipse.jdt.core)가 사용자의 `class Solution`을 컴파일해요. 입력·출력 JSON 변환과 채점은 `java-runtime/src/algoflow`의 하네스가 맡고, 같은 하네스를 Node 검증(진짜 JDK)에서도 써요.

- 첫 실행 때 CheerpJ 런타임을 CDN(`cjrtnc.leaningtech.com`)에서 받느라 10~20초 걸리고, 그 뒤엔 브라우저 캐시로 빨라져요.
- 브라우저 JVM은 재귀 깊이 약 2,000까지 안전하고, 런타임 예외에 줄 번호를 주지 못해 어느 메서드에서 났는지만 알려 줘요.
- **라이선스**: CheerpJ는 개인·비상업 용도는 무료이고, 상업 서비스로 운영하려면 Leaning Technologies의 라이선스가 필요해요 (`cheerpjInit`의 `licenseKey`). ECJ(`public/java/ecj.jar`)는 EPL-2.0이에요 (`public/java/NOTICE.md`).

## 구조

```
src/
  app/            라우트 ((app) 그룹 = 사이드바/하단탭 셸, (workspace) = 풀이 화면, api/ = AI 코치·문제 생성)
  components/     common · mascot · layout · auth · dashboard · roadmap · topic · learn · visualizer · workspace · coach · ai-lab · me · ui(shadcn)
  content/        토픽 · 개념 카드·퀴즈 · 시각화 예시 · 문제 · 유형 신호 · 패턴 이름 (정적 콘텐츠)
  lib/            진도 규칙(브라우저·서버 공통) · 시각화 · 실행기(브라우저) · runner-node(서버 Python) · ai(코치·생성 파이프라인) · supabase · server · 날짜 · 모션
  stores/         zustand (게스트 진도·제출 기록·코드 초안·코치 대화는 localStorage, 로그인 상태)
  types/          데이터 모델 (docs/04와 동일)
content-solutions/  문제별 Python·JS 정답 코드 (클라이언트 번들 제외)
supabase/       마이그레이션 (스키마·RLS·진도 RPC·배지), config.toml
tests/
```
