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

### Supabase 연결

1. Supabase 프로젝트를 만들고 `supabase/migrations/`를 순서대로 적용합니다 (`supabase link` → `supabase db push`, 또는 SQL 편집기에 파일 순서대로 붙여 넣기).
2. Authentication → URL Configuration에 `http://localhost:3000/auth/callback`(배포 주소도)을 Redirect URL로 추가합니다.
3. 소셜 로그인을 쓰려면 대시보드에서 제공자를 켜고 `NEXT_PUBLIC_AUTH_PROVIDERS`에 적습니다.
4. 위 환경 변수 세 개를 넣고 다시 실행합니다. 게스트로 쌓은 진도는 첫 로그인 때 계정으로 옮겨집니다.

## 명령

| 명령                        | 설명                                                                                                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`                  | 개발 서버                                                                                                                                                            |
| `pnpm build` / `pnpm start` | 프로덕션 빌드 / 실행                                                                                                                                                 |
| `pnpm typecheck`            | 라우트 타입 생성 + `tsc`                                                                                                                                             |
| `pnpm lint`                 | ESLint                                                                                                                                                               |
| `pnpm test`                 | Vitest (진도 규칙, 채점기, JS·Python 하네스, 시각화, 개념 학습 화면, AI 코치 가드·문제 생성 파이프라인·서버 Python 러너, PGlite로 마이그레이션·RLS·진도 RPC 검증 등) |
| `pnpm validate:content`     | 모든 문제의 Python·JS 정답 코드를 실제 하네스로 실행해 기대값 검증 (Pyodide). `JAVA_HOME`에 JDK 11+가 있으면 Java 정답도 같은 Java 하네스로 검증                     |
| `pnpm build:java`           | Java 채점 하네스(`java-runtime/src`)를 `public/java/algoflow-runner.jar`로 빌드 (JDK 11+ 필요, 결과 jar는 커밋)                                                      |
| `pnpm ai:smoke [횟수]`      | 실제 Claude API로 AI 문제를 여러 번(기본 10회) 생성·검증해 통과율 확인 (API 비용 발생)                                                                               |
| `pnpm format`               | Prettier                                                                                                                                                             |

개발 서버에서는 화면 오른쪽 아래 🔧 버튼(개발용 도구)으로 예시 진도 불러오기 · XP 추가 · 축하 연출 · 진도 초기화를 할 수 있습니다. 프로덕션 빌드에는 나타나지 않습니다.

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
